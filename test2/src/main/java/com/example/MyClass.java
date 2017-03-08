package com.example;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Date;

public class MyClass {
    public static void main (String args[]){
        String htmlContent = readFile("/Users/dengwenbin/Desktop/devices.html");
        String newHtmlContent = htmlContent.replaceAll("TIMESTAMP", String.format("%d", new Date().getTime()));
        System.out.println(newHtmlContent);
    }

    public static String readFile(String pathName) {
        String string = null;
        try {
            InputStream inputStream = new FileInputStream(new File(pathName));
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "UTF-8");
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
            String line;
            StringBuilder stringBuilder = new StringBuilder();
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line);
            }
            bufferedReader.close();
            inputStreamReader.close();
            string = stringBuilder.toString();
        }
        catch (IOException e) {
            e.printStackTrace();
        }

        return string;
    }
}
