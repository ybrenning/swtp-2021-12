class main {
    public static void main(Strg[] args){
        
        //kanzi 1
        kanzi.Global.computeHistogramOrder(args);

        System.out.println(0);
        for(int x = 1; x <= 1000; x++){
            StringBuilder word = new StringBuilder();
            if(x % 3 == 0) {word.append("fizz");}
            if(x % 5 == 0) {word.append("buzz");}
            if(x % 7 == 0) {word.append("bang");}

            if(word.length() > 1){
                //kanzi 2
                kanzi.app.BlockCompressor$FileCompressTask.call();

                word.toString();
                System.out.println(word);
            } else {
                //kanzi 3
                kanzi.bitstream.DefaultOutputBitStream.close();
                
                System.out.println(x);
            }
        }
    }
}
