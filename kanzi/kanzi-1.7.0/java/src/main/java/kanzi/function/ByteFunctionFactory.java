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

package kanzi.function;

import java.util.Map;
import kanzi.ByteTransform;
import kanzi.transform.BWTS;
import kanzi.transform.SBRT;


public class ByteFunctionFactory
{
   private static final int ONE_SHIFT = 6; // bits per transform
   private static final int MAX_SHIFT = (8-1) * ONE_SHIFT; // 8 transforms
   private static final int MASK = (1<<ONE_SHIFT) - 1;
   
   // Up to 64 transforms can be declared (6 bit index)
   public static final short NONE_TYPE    = 0;  // copy
   public static final short BWT_TYPE     = 1;  // Burrows Wheeler
   public static final short BWTS_TYPE    = 2;  // Burrows Wheeler Scott
   public static final short LZ_TYPE      = 3;  // Lempel Ziv
   public static final short SNAPPY_TYPE  = 4;  // Snappy (obsolete)
   public static final short RLT_TYPE     = 5;  // Run Length 
   public static final short ZRLT_TYPE    = 6;  // Zero Run Length
   public static final short MTFT_TYPE    = 7;  // Move To Front
   public static final short RANK_TYPE    = 8;  // Rank
   public static final short X86_TYPE     = 9;  // X86 codec
   public static final short DICT_TYPE    = 10; // Text codec
   public static final short ROLZ_TYPE    = 11; // ROLZ codec
   public static final short ROLZX_TYPE   = 12; // ROLZ Extra codec
   public static final short SRT_TYPE     = 13; // Sorted Rank
   public static final short LZP_TYPE     = 14; // Lempel Ziv Predict
 

   // The returned type contains 8 transform values
   public long getType(String name)
   {
      if (name.indexOf('+') < 0)
         return this.getTypeToken(name) << MAX_SHIFT;
      
      String[] tokens = name.split("\\+");
      
      if (tokens.length == 0)
         throw new IllegalArgumentException("Unknown transform type: " + name);

      if (tokens.length > 8)
         throw new IllegalArgumentException("Only 8 transforms allowed: " + name);

      long res = 0;
      int shift = MAX_SHIFT;
      
      for (String token: tokens)
      {
         final long typeTk = this.getTypeToken(token);
         
         // Skip null transform
         if (typeTk != NONE_TYPE)
         {
            res |= (typeTk << shift);
            shift -= ONE_SHIFT;
         }
      }
      
      return res;
   }
   
   
   private long getTypeToken(String name)
   {
      // Strings in switch not supported in JDK 6
      name = String.valueOf(name).toUpperCase();
      
      switch (name)
      {
         case "TEXT":
            return DICT_TYPE;

         case "BWT":
            return BWT_TYPE;

         case "BWTS":
            return BWTS_TYPE;

         case "LZ":
            return LZ_TYPE;

         case "LZP":
            return LZP_TYPE;

         case "ROLZ":
            return ROLZ_TYPE;

         case "ROLZX":
            return ROLZX_TYPE;

         case "SRT":
            return SRT_TYPE;

         case "RANK":
            return RANK_TYPE;

         case "MTFT":
            return MTFT_TYPE;

         case "ZRLT":
            return ZRLT_TYPE;

         case "RLT":
            return RLT_TYPE;

         case "X86":
            return X86_TYPE;

         case "NONE":
            return NONE_TYPE;

         default:
            throw new IllegalArgumentException("Unknown transform type: '" + name + "'");
      }
   }
   
   
   public ByteTransformSequence newFunction(Map<String, Object> ctx, long functionType)
   {      
      int nbtr = 0;
      
      // Several transforms
      for (int i=0; i<8; i++)
      {
         if (((functionType >>> (MAX_SHIFT-ONE_SHIFT*i)) & MASK) != NONE_TYPE)
            nbtr++;
      }
    
      // Only null transforms ? Keep first.
      if (nbtr == 0)
         nbtr = 1;
      
      ByteTransform[] transforms = new ByteTransform[nbtr];
      nbtr = 0;
      
      for (int i=0; i<transforms.length; i++)
      {
         final int t = (int) ((functionType >>> (MAX_SHIFT-ONE_SHIFT*i)) & MASK);

         if ((t != NONE_TYPE) || (i == 0))
            transforms[nbtr++] = newFunctionToken(ctx, t);
      }
    
      return new ByteTransformSequence(transforms);
   }
   
   
   private static ByteTransform newFunctionToken(Map<String, Object> ctx, int functionType)
   {
      switch (functionType)
      {
         case DICT_TYPE:            
            String entropyType = (String) ctx.getOrDefault("codec", "NONE");
            entropyType = entropyType.toUpperCase();
            int textCodecType  = 1;
            
            // Select text encoding based on entropy codec.
            if (entropyType.equals("NONE") || entropyType.equals("ANS0") ||
                entropyType.equals("HUFFMAN") || entropyType.equals("RANGE"))
               textCodecType = 2;
               
            ctx.put("textcodec", textCodecType);
            return new TextCodec(ctx);

         case ROLZ_TYPE:
            return new ROLZCodec(ctx);
            
         case ROLZX_TYPE:
            return new ROLZCodec(ctx);
            
         case BWT_TYPE:
            return new BWTBlockCodec(ctx); 
            
         case BWTS_TYPE:
            return new BWTS(ctx);    
            
         case RANK_TYPE:
            ctx.put("sbrt", SBRT.MODE_RANK);
            return new SBRT(ctx);
                        
         case SRT_TYPE:
            return new SRT(ctx);
                        
         case MTFT_TYPE:
            ctx.put("sbrt", SBRT.MODE_MTF);
            return new SBRT(ctx);

         case ZRLT_TYPE:
            return new ZRLT(ctx);
            
         case RLT_TYPE:
            return new RLT(ctx);
                        
         case LZ_TYPE:
            ctx.put("lz", LZ_TYPE);
            return new LZCodec(ctx);
            
         case LZP_TYPE:
            ctx.put("lz", LZP_TYPE);
            return new LZCodec(ctx);
            
         case X86_TYPE:
            return new X86Codec(ctx);
            
         case NONE_TYPE:
            return new NullFunction(ctx);
            
         default:
            throw new IllegalArgumentException("Unknown transform type: '" + functionType + "'");
      }
   }

   
   public String getName(long functionType)
   {              
      StringBuilder sb = new StringBuilder();

      for (int i=0; i<8; i++)
      {
         final int t = (int) (functionType >>> (MAX_SHIFT-ONE_SHIFT*i)) & MASK;

         if (t == NONE_TYPE)
            continue;

         String name = getNameToken(t);

         if (sb.length() != 0)
            sb.append('+');

         sb.append(name);
      }

      if (sb.length() == 0)
         sb.append(getNameToken(NONE_TYPE));

      return sb.toString();
   }
   
   
   private static String getNameToken(int functionType)
   {
      switch (functionType)
      {
         case DICT_TYPE:
            return "TEXT";
            
         case ROLZ_TYPE:
            return "ROLZ";
            
         case ROLZX_TYPE:
            return "ROLZX";
            
         case BWT_TYPE:
            return "BWT";

         case BWTS_TYPE:
            return "BWTS";
            
         case SRT_TYPE:
            return "SRT";
            
         case RANK_TYPE:
            return "RANK";
            
         case MTFT_TYPE:
            return "MTFT";

         case ZRLT_TYPE:
            return "ZRLT";
            
         case RLT_TYPE:
            return "RLT";
            
         case X86_TYPE:
            return "X86";
            
         case LZ_TYPE:
            return "LZ";
                        
         case LZP_TYPE:
            return "LZP";
                        
         case NONE_TYPE:
            return "NONE";
            
         default:
            throw new IllegalArgumentException("Unknown transform type: '" + functionType + "'");
      }
   }
}
