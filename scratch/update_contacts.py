import os

def update_contacts():
    # Define replacements
    replacements = [
        # Emails
        ("sales@fourwaysinternational.com", "sales@fourwaysint.com"),
        ("info@fourwaysinternational.com", "sales@fourwaysint.com"),
        
        # Phone number URL formats (WhatsApp, tel, etc.)
        ("wa.me/919345540373", "wa.me/33605705699"),
        ("wa.me/91-9345540373", "wa.me/33605705699"),
        ('phoneNumber = "919345540373"', 'phoneNumber = "33605705699"'),
        ('phoneNumber = \'919345540373\'', 'phoneNumber = \'33605705699\''),
        ("tel:9345540373", "tel:+33605705699"),
        ("tel:+919345540373", "tel:+33605705699"),
        ("tel:+91-9345540373", "tel:+33605705699"),
        ("tel:91-9345540373", "tel:+33605705699"),
        
        # Display formats
        ("+91-9345540373", "+33 6 05 70 56 99"),
        ("91-9345540373", "+33 6 05 70 56 99"),
        ("📞+91-9345540373", "📞 +33 6 05 70 56 99"),
        ("📞 9345540373", "📞 +33 6 05 70 56 99"),
        
        # General fallbacks
        ("9345540373", "+33 6 05 70 56 99"),
        ("919345540373", "33605705699"),
        ("Nature%20Care%20Impex", "Fourways%20International%20Trading"),
        ("Nature+Care+Impex", "Fourways+International+Trading")
    ]

    target_dir = r"d:\FOUR WAYS\four ways"
    exclude_dirs = {".git", "node_modules"}
    allowed_exts = {".html", ".js", ".css", ".md", ".yaml", ".yml", ".env", ".example", ".txt"}

    print("Starting contact details update...")
    
    modified_files = []

    for root, dirs, files in os.walk(target_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in allowed_exts or file.startswith(".env"):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    original_content = content
                    for old, new in replacements:
                        content = content.replace(old, new)
                    
                    if content != original_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {os.path.relpath(filepath, target_dir)}")
                        modified_files.append(filepath)
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

    print(f"\nUpdate complete. Total files updated: {len(modified_files)}")

if __name__ == "__main__":
    update_contacts()
