# Text/Sound Similarity Check

## Overview

This Python scripts designed for analyzing similarities in both sound and text. This is one of some of the codes used in the project to develop a web server that finds music. This Python script allows you to compare the text/audio input to the text/audio information stored on the server to find the most similar items.

## Features

- **Text Similarity Analysis**: Compare the similarity between the input text and the stored text. Text similarity comparisons are estimated using the Levenshtein Distance algorithm.
- **Sound Similarity Analysis**: Compare the similarity between the input audio file and the stored audio file. To estimate the similarity between the two sounds, it compute using MFCC and DTW.

## How It Works

- **Text Similarity**: It uses the `Levenshtein Distance` algorithm, also called `Edit Distance`. This means the number of insertion, deletion, and replacement operations required to convert one string into another. This algorithm method has the disadvantage of decreasing the result value as the length of the string is shorter. Therefore, additional correction values are used. The Levenshtein Distance algorithm follows these steps:
  1. Get the length of two strings, Initialize the two-dimensional matrix according to its length
  2. Initialize the first row and first column of the matrix to have values from 0 to m and n.
  3. Fill in the matrix by comparing each character in the two strings.
  4. If the two characters are the same, the value at that location gets the value of the upper left diagonal, Otherwise, fill in the minimum value plus 1 among the values of the left, upper, and upper left diagonal.
  5. The value in the lower right of the matrix is the Levenshtein Distance between the two strings.
- **Sound Similarity**: Two algorithms, `MFCC(Mel Frequency Cepstral Coefficients)` and `DTW(Dynamic Time Warping)`, were used as methods to compare the similarity of the two sounds. Since similarity between sounds cannot be directly compared, it compute similarity between time series data using DTW after conversion to low-dimensional feature vectors through MFCC. This is the process of comparing using algorithms:
  1. Extracted MFCC feature vectors for the two sounds you want to compare.
  2. The DTW algorithm is applied using the extracted MFCC feature vector.
  3. Represent the feature vector of each sound as a two-dimensional grid, and map each cell within the grid.
  4. Calculate the optimal path using euclidean distance.
