import os

# Define the folder containing the obstacle images
output_folder = 'obstacles'

# List all files in the folder
all_files = os.listdir(output_folder)

# Sort the files to ensure a consistent order
all_files.sort()

# Keep images with numbers from 1 to 17 and delete the rest
for filename in all_files:
    # Extract the number from the filename (assuming the format is 'obstacle_X.png')
    number_part = filename.split('_')[1].split('.')[0]  # Gets the number part
    if number_part.isdigit() and int(number_part) > 17:  # Check if the number is greater than 17
        file_path = os.path.join(output_folder, filename)
        os.remove(file_path)  # Delete the file
        print(f"Deleted: {file_path}")

print("Deletion complete. Remaining images:", os.listdir(output_folder))
