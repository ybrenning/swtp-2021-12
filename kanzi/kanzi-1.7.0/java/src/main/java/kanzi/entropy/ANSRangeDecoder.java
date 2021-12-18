/*
Copyright 2011-2017 Frederic Langlet
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
you may obtain a copy of the License at

                http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package kanzi.entropy;

import kanzi.BitStreamException;
import kanzi.EntropyDecoder;
import kanzi.InputBitStream;

// Implementation of an Asymmetric Numeral System decoder.
// See "Asymmetric Numeral System" by Jarek Duda at http://arxiv.org/abs/0902.0271
// Some code has been ported from https://github.com/rygorous/ryg_rans
// For an alternate C implementation example, see https://github.com/Cyan4973/FiniteStateEntropy

public class ANSRangeDecoder implements EntropyDecoder
{
   private static final int ANS_TOP = 1 << 15; // max possible for ANS_TOP=1<23
   private static final int DEFAULT_ANS0_CHUNK_SIZE = 1 << 15; // 32 KB by default
   private static final int DEFAULT_LOG_RANGE = 12;
   private static final int MAX_CHUNK_SIZE = 1 << 27; // 8*MAX_CHUNK_SIZE must not overflow

   private final InputBitStream bitstream;
   private final int[][] alphabet;
   private final int[][] freqs;
   private final byte[][] f2s; // mapping frequency -> symbol
   private final Symbol[][] symbols;
   private byte[] buffer;
   private final int chunkSize;
   private final int order;
   private int logRange;


   public ANSRangeDecoder(InputBitStream bs)
   {
      this(bs, 0, DEFAULT_ANS0_CHUNK_SIZE);
   }

   
   public ANSRangeDecoder(InputBitStream bs, int order)
   {
      this(bs, order, DEFAULT_ANS0_CHUNK_SIZE<<(8*(order&1)));
   }

   
   // chunkSize = 0 means 'use input buffer length' during decoding
   public ANSRangeDecoder(InputBitStream bs, int order, int chunkSize)
   {
      if (bs == null)
         throw new NullPointerException("ANS Codec: Invalid null bitstream parameter");

      if ((order != 0) && (order != 1))
         throw new IllegalArgumentException("ANS Codec: The order must be 0 or 1");

      if ((chunkSize != 0) && (chunkSize < 1024))
         throw new IllegalArgumentException("ANS Codec: The chunk size must be at least 1024");

      if (chunkSize > MAX_CHUNK_SIZE)
         throw new IllegalArgumentException("ANS Codec: The chunk size must be at most "+MAX_CHUNK_SIZE);

      this.bitstream = bs;
      this.chunkSize = chunkSize;
      this.order = order;
      final int dim = 255*order + 1;
      this.alphabet = new int[dim][256];
      this.freqs = new int[dim][256];
      this.f2s = new byte[dim][256];
      this.symbols = new Symbol[dim][256];
      this.buffer = new byte[0];
      this.logRange = DEFAULT_LOG_RANGE;
      
      for (int i=0; i<dim; i++)
      {
         this.alphabet[i] = new int[256];
         this.freqs[i] = new int[256];
         this.f2s[i] = new byte[0];
         this.symbols[i] = new Symbol[256];
      }
   }


   @Override
   public int decode(byte[] block, int blkptr, int count)
   {
      if ((block == null) || (blkptr+count > block.length) || (blkptr < 0) || (count < 0))
         return -1;

      if (count == 0)
         return 0;

      final int end = blkptr + count;
      int sizeChunk = (this.chunkSize == 0) ? count : this.chunkSize;
      
      if (sizeChunk >= MAX_CHUNK_SIZE)
         sizeChunk = MAX_CHUNK_SIZE;
      
      int startChunk = blkptr;
      final int endk = 255*this.order + 1;
      
      for (int k=0; k<endk; k++)
      {
         Symbol[] syms = this.symbols[k];

         for (int i=0; i<256; i++)
            syms[i] = new Symbol();
      }

      // Add some padding
      if (this.buffer.length < sizeChunk+(sizeChunk>>3))
         this.buffer = new byte[sizeChunk+(sizeChunk>>3)];

      while (startChunk < end)
      {
         if (this.decodeHeader(this.freqs) == 0)
            return startChunk - blkptr;
      
         final int endChunk = (startChunk+sizeChunk < end) ? startChunk + sizeChunk : end;
         this.decodeChunk(block, startChunk, endChunk);        
         startChunk = endChunk;
      }

      return count;
   }

   
   protected void decodeChunk(byte[] block, int start, final int end)
   {
      // Read chunk size
      final int sz = EntropyUtils.readVarInt(this.bitstream) & (MAX_CHUNK_SIZE-1);
           
      // Read initial ANS state
      int st = (int) this.bitstream.readBits(32);
      
      if (sz != 0)
         this.bitstream.readBits(this.buffer, 0, 8*sz);
      
      int n = 0;
      final int mask = (1<<this.logRange) - 1;

      if (this.order == 0)
      {
         final byte[] freq2sym = this.f2s[0];
         final Symbol[] symb = this.symbols[0];
            
         for (int i=start; i<end; i++)
         {
            final byte cur = freq2sym[st&mask];
            block[i] = cur;                     
            final Symbol sym = symb[cur&0xFF];
            
            // Compute next ANS state
            // D(x) = (s, q_s (x/M) + mod(x,M) - b_s) where s is such b_s <= x mod M < b_{s+1}
            st = sym.freq * (st>>>this.logRange) + (st&mask) - sym.cumFreq;

            // Normalize
            while (st < ANS_TOP) 
            {
               st = (st<<8) | (this.buffer[n] & 0xFF);         
               st = (st<<8) | (this.buffer[n+1] & 0xFF);  
               n += 2;
            }
         }
      }
      else
      {
         int prv = 0;
         
         for (int i=start; i<end; i++)
         {
            final int cur = this.f2s[prv][st&mask] & 0xFF;
            block[i] = (byte) cur;
            final Symbol sym = this.symbols[prv][cur];

            // Compute next ANS state
            // D(x) = (s, q_s (x/M) + mod(x,M) - b_s) where s is such b_s <= x mod M < b_{s+1}
            st = sym.freq * (st>>>this.logRange) + (st&mask) - sym.cumFreq;

            // Normalize
            while (st < ANS_TOP) 
            {
               st = (st<<8) | (this.buffer[n] & 0xFF);         
               st = (st<<8) | (this.buffer[n+1] & 0xFF);  
               n += 2;
            }

            prv = cur;
         }             
      } 
   }
   

   // Decode alphabet and frequencies
   protected int decodeHeader(int[][] frequencies)
   {
      this.logRange = (int) (8 + this.bitstream.readBits(3));

      if ((this.logRange < 8) || (this.logRange > 16))
         throw new IllegalArgumentException("ANS Codec: Invalid range: "+this.logRange+" (must be in [8..16])");

      int res = 0;
      final int dim = 255*this.order + 1;
      final int scale = 1 << this.logRange;

      for (int k=0; k<dim; k++)
      {
         final int[] f = frequencies[k];
         final int[] alphabet_ = this.alphabet[k];
         int alphabetSize = EntropyUtils.decodeAlphabet(this.bitstream, alphabet_);

         if (alphabetSize == 0)
            continue;

         if (alphabetSize != f.length)
         {
            for (int i=f.length-1; i>=0; i--)
               f[i] = 0;
         }

         if (this.f2s[k].length < scale)
            this.f2s[k] = new byte[scale];

         final int chkSize = (alphabetSize >= 64) ? 8 : 6;
         int sum = 0;
         int llr = 3;

         while (1<<llr <= this.logRange)
            llr++;

         // Decode all frequencies (but the first one) by chunks 
         for (int i=1; i<alphabetSize; i+=chkSize)
         {
            // Read frequencies size for current chunk
            final int logMax = (int) (1 + this.bitstream.readBits(llr));
            
            if (1<<logMax > scale)
            {
               throw new BitStreamException("Invalid bitstream: incorrect frequency size " +
                       logMax + " in ANS range decoder", BitStreamException.INVALID_STREAM);
            }

            final int endj = (i+chkSize < alphabetSize) ? i + chkSize : alphabetSize;

            // Read frequencies
            for (int j=i; j<endj; j++)
            {
               final int freq = (int) (1 + this.bitstream.readBits(logMax));

               if ((freq <= 0) || (freq >= scale))
               {
                  throw new BitStreamException("Invalid bitstream: incorrect frequency " +
                          freq + " for symbol '" + alphabet_[j] + "' in ANS range decoder",
                          BitStreamException.INVALID_STREAM);
               }

               f[alphabet_[j]] = freq;
               sum += freq;
            }
         }

         // Infer first frequency
         if (scale <= sum)
         {
            throw new BitStreamException("Invalid bitstream: incorrect frequency " +
                    f[alphabet_[0]] + " for symbol '" + alphabet_[0] +
                    "' in ANS range decoder", BitStreamException.INVALID_STREAM);
         }

         f[alphabet_[0]] = scale - sum;
         sum = 0;
         final Symbol[] symb = this.symbols[k];
         final byte[] freq2sym = this.f2s[k];

         // Create reverse mapping
         for (int i=0; i<f.length; i++)
         {
            if (f[i] == 0)
               continue;
            
            for (int j=f[i]-1; j>=0; j--)
               freq2sym[sum+j] = (byte) i;

            symb[i].reset(sum, f[i], this.logRange);
            sum += f[i];
         }

         res += alphabetSize;
      }

      return res;
   }


   @Override
   public InputBitStream getBitStream()
   {
      return this.bitstream;
   }


   @Override
   public void dispose() 
   {
   }
   
   
   static class Symbol
   {
      int cumFreq;
      int freq;


      public void reset(int cumFreq, int freq, int logRange)
      {     
         this.cumFreq = cumFreq;
         this.freq = (freq >= 1<<logRange) ? (1<<logRange) - 1 : freq; // Mirror encoder        
      }
   }   
}