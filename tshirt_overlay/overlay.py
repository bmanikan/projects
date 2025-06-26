import argparse
from typing import List
import numpy as np
import cv2


def overlay_tshirt(human_img_path: str, design_img_path: str, dest_points: List[float], output_path: str) -> None:
    """Overlay a design image on a T-shirt area of a human photo using perspective warp.

    Args:
        human_img_path: Path to the human model image.
        design_img_path: Path to the design image (preferably with alpha channel).
        dest_points: List of 8 numbers specifying the four destination points
            (x1 y1 x2 y2 x3 y3 x4 y4) of the area where the design should be placed.
        output_path: Path where the resulting image will be saved.
    """
    human = cv2.imread(human_img_path, cv2.IMREAD_COLOR)
    design = cv2.imread(design_img_path, cv2.IMREAD_UNCHANGED)
    if human is None:
        raise ValueError(f"Unable to read human image from {human_img_path}")
    if design is None:
        raise ValueError(f"Unable to read design image from {design_img_path}")

    h_d, w_d = design.shape[:2]
    src_pts = np.array([[0, 0], [w_d, 0], [w_d, h_d], [0, h_d]], dtype=np.float32)
    dst_pts = np.array(dest_points, dtype=np.float32).reshape((4, 2))

    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped = cv2.warpPerspective(
        design,
        matrix,
        (human.shape[1], human.shape[0]),
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(0, 0, 0, 0),
    )

    if warped.shape[2] == 4:
        overlay_rgb = warped[:, :, :3]
        mask = warped[:, :, 3]
    else:
        overlay_rgb = warped
        mask = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)

    mask = mask.astype(float) / 255.0
    mask = mask[:, :, np.newaxis]

    human_float = human.astype(float)
    overlay_rgb = overlay_rgb.astype(float)

    result = human_float * (1 - mask) + overlay_rgb * mask
    result = result.astype("uint8")

    cv2.imwrite(output_path, result)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Warp a design onto a T-shirt area in a photo.")
    parser.add_argument("human", help="Path to the human photo")
    parser.add_argument("design", help="Path to the design image (e.g. PNG with transparency)")
    parser.add_argument(
        "--points",
        nargs=8,
        type=float,
        required=True,
        metavar=("x1", "y1", "x2", "y2", "x3", "y3", "x4", "y4"),
        help="Destination points for the design in the human image",
    )
    parser.add_argument("--output", required=True, help="Path to save the composite image")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    overlay_tshirt(args.human, args.design, args.points, args.output)
