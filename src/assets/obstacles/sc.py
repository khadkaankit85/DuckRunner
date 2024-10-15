import cv2
import numpy as np
from PIL import Image
import os

# Load the image using OpenCV
input_image_path = 'obs.webp'
image = cv2.imread(input_image_path, cv2.IMREAD_UNCHANGED)

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply GaussianBlur to reduce noise
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# Apply thresholding to create a binary image
_, thresh = cv2.threshold(blurred, 200, 255, cv2.THRESH_BINARY_INV)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Filter contours based on area (adjust the area threshold as needed)
min_area = 1000  # Minimum area to consider a valid contour
filtered_contours = [cnt for cnt in contours if cv2.contourArea(cnt) >= min_area]

# Create a folder to save the images if needed
output_folder = 'obstacles'
os.makedirs(output_folder, exist_ok=True)

# Iterate over each filtered contour and save the corresponding obstacle image
for i, contour in enumerate(filtered_contours):
    # Get bounding box for each contour
    x, y, w, h = cv2.boundingRect(contour)

    # Crop the obstacle from the original image
    obstacle_image = image[y:y+h, x:x+w]

    # Create a mask for the obstacle
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.drawContours(mask, [contour - [x, y]], -1, (255), thickness=cv2.FILLED)

    # Create a transparent background
    transparent_obstacle = np.zeros((h, w, 4), dtype=np.uint8)  # 4 channels for RGBA
    transparent_obstacle[..., :3] = obstacle_image[:, :, :3]  # Copy RGB channels
    transparent_obstacle[..., 3] = mask  # Set alpha channel based on the mask

    # Optional: Remove the background using bitwise operation
    # This ensures that only the part of the image with the mask is kept
    obstacle_image_bgra = cv2.cvtColor(obstacle_image, cv2.COLOR_BGR2BGRA)
    obstacle_image_bgra[..., 3] = mask  # Set the alpha channel based on the mask

    # Save the cropped image as PNG
    output_path = os.path.join(output_folder, f'obstacle_{i + 1}.png')
    Image.fromarray(obstacle_image_bgra).save(output_path)

print(f"Extracted {len(filtered_contours)} obstacles with transparent backgrounds and saved them in the '{output_folder}' folder.")
