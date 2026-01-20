
import os

style_path = r'c:\xampp\htdocs\project\portfolio\assets\css\style.css'
clean_path = r'c:\xampp\htdocs\project\portfolio\assets\css\clean_part.css'

with open(style_path, 'rb') as f:
    content = f.read()

start_marker = b'.modal-close:hover {'
end_marker = b'/* === SUCCESS PAGE & ANIMATIONS === */'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    # Find the closing brace of the modal-close:hover rule
    brace_idx = content.find(b'}', start_idx)
    if brace_idx != -1:
        insert_pos = brace_idx + 1
        with open(clean_path, 'rb') as f:
            clean_part = f.read()
        
        new_content = content[:insert_pos] + b'\n' + clean_part + b'\n' + content[end_idx:]
        
        with open(style_path, 'wb') as f:
            f.write(new_content)
        print("CSS fixed successfully")
    else:
        print("Could not find closing brace")
else:
    print(f"Markers not found: start={start_idx}, end={end_idx}")
