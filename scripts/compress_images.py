import os
from PIL import Image

public_dir = r"c:\Users\danwi\T.Ton\public"

total_saved = 0
orig_total = 0
new_total = 0

for filename in os.listdir(public_dir):
    filepath = os.path.join(public_dir, filename)
    ext = os.path.splitext(filename)[1].lower()
    
    if ext in ['.png', '.jpg', '.jpeg']:
        size_before = os.path.getsize(filepath)
        orig_total += size_before
        
        try:
            with Image.open(filepath) as img:
                img = img.convert('RGB')
                
                # Determine max dimensions
                if 'hero' in filename:
                    max_dim = (1600, 1600)
                    quality = 82
                elif 'cover' in filename or filename.startswith('student') or filename == 'instructor.jpg':
                    max_dim = (600, 600)
                    quality = 80
                else: # 1_0.png, 2_0.png, etc.
                    max_dim = (800, 800)
                    quality = 82
                
                img.thumbnail(max_dim, Image.Resampling.LANCZOS)
                
                # Overwrite/Save as compressed JPG if originally heavy PNG, or compress in place
                if ext == '.png' and size_before > 500000: # Larger than 500KB PNG
                    # Save as optimized JPG
                    jpg_path = os.path.splitext(filepath)[0] + '.jpg'
                    img.save(filepath, 'JPEG', quality=quality, optimize=True)
                else:
                    img.save(filepath, 'JPEG' if ext in ['.jpg', '.jpeg'] else 'PNG', quality=quality, optimize=True)
                
                size_after = os.path.getsize(filepath)
                new_total += size_after
                print(f"Compressed {filename}: {size_before/1024/1024:.2f}MB -> {size_after/1024:.1f}KB ({100 - (size_after/size_before*100):.1f}% smaller)")
        except Exception as e:
            print(f"Error compressing {filename}: {e}")

print(f"\nTOTAL SAVED: {orig_total/1024/1024:.2f}MB -> {new_total/1024/1024:.2f}MB (Overall reduction: {100 - (new_total/orig_total*100):.1f}%)")
