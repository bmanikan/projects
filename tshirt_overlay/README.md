# T-Shirt Overlay

This small script demonstrates how to warp a design image onto the T-shirt area
of a photo. The script requires OpenCV and NumPy.

## Usage

```
python overlay.py path/to/human.jpg path/to/design.png \
    --points x1 y1 x2 y2 x3 y3 x4 y4 --output result.jpg
```

The `--points` argument specifies the four destination points in the human image
where the design corners should map, starting from the top-left corner and
continuing clockwise.
