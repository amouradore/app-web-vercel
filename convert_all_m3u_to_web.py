#!/usr/bin/env python3
"""
Script pour convertir TOUS vos fichiers M3U vers les services web AceStream
Usage: python convert_all_m3u_to_web.py
"""
import os
import sys
import shutil
from acestream_web_converter import AceStreamWebConverter

def main():
    print("🔄 CONVERSION MASSIVE M3U → WEB ACESTREAM")
    print("=" * 55)
    
    converter = AceStreamWebConverter()
    
    # Trouver tous les fichiers M3U
    m3u_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.m3u'):
                full_path = os.path.join(root, file)
                m3u_files.append(full_path)
    
    if not m3u_files:
        print("❌ Aucun fichier M3U trouvé dans le répertoire")
        return
    
    print(f"📁 Fichiers M3U trouvés: {len(m3u_files)}")
    for i, file_path in enumerate(m3u_files, 1):
        print(f"   {i}. {file_path}")
    
    print(f"\n🚀 Début de la conversion...")
    
    converted_count = 0
    failed_count = 0
    
    for file_path in m3u_files:
        print(f"\n🔄 Conversion de: {file_path}")
        
        # Créer le nom du fichier de sortie
        dir_name = os.path.dirname(file_path)
        base_name = os.path.basename(file_path)
        web_file_name = base_name.replace('.m3u', '_web.m3u')
        web_file_path = os.path.join(dir_name, web_file_name)
        
        # Convertir le fichier
        success = converter.convert_m3u_file(file_path, web_file_path)
        
        if success:
            converted_count += 1
            print(f"   ✅ Converti: {web_file_path}")
            
            # Optionnel: remplacer le fichier original par la version web
            replace_original = input(f"   🔄 Remplacer '{base_name}' par la version web ? (o/N): ").lower()
            if replace_original in ['o', 'oui', 'y', 'yes']:
                # Sauvegarder l'original
                backup_name = base_name.replace('.m3u', '_original_backup.m3u')
                backup_path = os.path.join(dir_name, backup_name)
                shutil.copy2(file_path, backup_path)
                
                # Remplacer par la version web
                shutil.copy2(web_file_path, file_path)
                
                print(f"   💾 Original sauvegardé: {backup_name}")
                print(f"   🔄 '{base_name}' remplacé par la version web")
        else:
            failed_count += 1
            print(f"   ❌ Échec de conversion")
    
    print(f"\n📊 RÉSUMÉ DE LA CONVERSION")
    print(f"✅ Réussies: {converted_count}")
    print(f"❌ Échecs: {failed_count}")
    print(f"📁 Total traité: {len(m3u_files)}")
    
    if converted_count > 0:
        print(f"\n🎯 PROCHAINES ÉTAPES:")
        print(f"1. ✅ Vos fichiers M3U sont maintenant compatibles web")
        print(f"2. ✅ Les utilisateurs peuvent regarder sans installer AceStream")
        print(f"3. 🚀 Déployez votre application mise à jour")
        print(f"4. 📱 Testez sur mobile et desktop")
        
        # Instructions de déploiement
        print(f"\n📋 DÉPLOIEMENT SUR GITHUB/VERCEL:")
        print(f"git add .")
        print(f"git commit -m 'Convert to web AceStream - no installation required'")
        print(f"git push origin main")
        print(f"\n🌐 Votre app sera automatiquement redéployée sur Vercel !")

if __name__ == "__main__":
    main()