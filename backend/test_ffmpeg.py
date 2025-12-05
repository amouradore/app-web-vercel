#!/usr/bin/env python3
"""
Script de test pour vérifier l'installation et le fonctionnement de FFmpeg
"""
import subprocess
import sys
import os

def test_ffmpeg_installed():
    """Teste si FFmpeg est installé"""
    print("🔍 Test 1: Vérification de l'installation de FFmpeg...")
    try:
        result = subprocess.run(['ffmpeg', '-version'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0]
            print(f"✅ FFmpeg installé: {version_line}")
            return True
        else:
            print(f"❌ FFmpeg retourne une erreur: {result.stderr}")
            return False
    except FileNotFoundError:
        print("❌ FFmpeg n'est pas installé ou pas dans le PATH")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_h264_codec():
    """Teste si le codec H.264 est disponible"""
    print("\n🔍 Test 2: Vérification du codec H.264...")
    try:
        result = subprocess.run(['ffmpeg', '-codecs'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if 'h264' in result.stdout.lower():
            print("✅ Codec H.264 disponible")
            return True
        else:
            print("❌ Codec H.264 non trouvé")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_aac_codec():
    """Teste si le codec AAC est disponible"""
    print("\n🔍 Test 3: Vérification du codec AAC...")
    try:
        result = subprocess.run(['ffmpeg', '-codecs'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if 'aac' in result.stdout.lower():
            print("✅ Codec AAC disponible")
            return True
        else:
            print("❌ Codec AAC non trouvé")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_hls_format():
    """Teste si le format HLS est supporté"""
    print("\n🔍 Test 4: Vérification du format HLS...")
    try:
        result = subprocess.run(['ffmpeg', '-formats'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if 'hls' in result.stdout.lower():
            print("✅ Format HLS supporté")
            return True
        else:
            print("❌ Format HLS non supporté")
            return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_ffmpeg_conversion():
    """Teste une conversion simple avec FFmpeg"""
    print("\n🔍 Test 5: Test de conversion (génération d'une vidéo test)...")
    try:
        # Créer un dossier temp
        os.makedirs('/tmp/ffmpeg_test', exist_ok=True)
        
        # Générer une vidéo test de 5 secondes
        cmd = [
            'ffmpeg',
            '-f', 'lavfi',
            '-i', 'testsrc=duration=5:size=640x480:rate=25',
            '-f', 'lavfi',
            '-i', 'sine=frequency=1000:duration=5',
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-t', '5',
            '-y',  # Overwrite
            '/tmp/ffmpeg_test/test.mp4'
        ]
        
        result = subprocess.run(cmd, 
                              capture_output=True, 
                              text=True, 
                              timeout=30)
        
        if result.returncode == 0 and os.path.exists('/tmp/ffmpeg_test/test.mp4'):
            file_size = os.path.getsize('/tmp/ffmpeg_test/test.mp4')
            print(f"✅ Conversion test réussie (fichier: {file_size} bytes)")
            # Nettoyage
            os.remove('/tmp/ffmpeg_test/test.mp4')
            os.rmdir('/tmp/ffmpeg_test')
            return True
        else:
            print(f"❌ Échec de la conversion: {result.stderr[:200]}")
            return False
    except subprocess.TimeoutExpired:
        print("❌ Timeout lors de la conversion")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_hls_segmentation():
    """Teste la segmentation HLS"""
    print("\n🔍 Test 6: Test de segmentation HLS...")
    try:
        os.makedirs('/tmp/ffmpeg_hls_test', exist_ok=True)
        
        cmd = [
            'ffmpeg',
            '-f', 'lavfi',
            '-i', 'testsrc=duration=10:size=640x480:rate=25',
            '-f', 'lavfi',
            '-i', 'sine=frequency=1000:duration=10',
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-f', 'hls',
            '-hls_time', '2',
            '-hls_list_size', '6',
            '-hls_flags', 'delete_segments',
            '-t', '10',
            '-y',
            '/tmp/ffmpeg_hls_test/playlist.m3u8'
        ]
        
        result = subprocess.run(cmd, 
                              capture_output=True, 
                              text=True, 
                              timeout=30)
        
        if result.returncode == 0 and os.path.exists('/tmp/ffmpeg_hls_test/playlist.m3u8'):
            # Compter les segments créés
            segments = [f for f in os.listdir('/tmp/ffmpeg_hls_test') if f.endswith('.ts')]
            print(f"✅ Segmentation HLS réussie ({len(segments)} segments créés)")
            
            # Nettoyage
            for f in os.listdir('/tmp/ffmpeg_hls_test'):
                os.remove(os.path.join('/tmp/ffmpeg_hls_test', f))
            os.rmdir('/tmp/ffmpeg_hls_test')
            return True
        else:
            print(f"❌ Échec de la segmentation: {result.stderr[:200]}")
            return False
    except subprocess.TimeoutExpired:
        print("❌ Timeout lors de la segmentation")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Lance tous les tests"""
    print("=" * 60)
    print("🎬 Tests d'installation et de fonctionnement de FFmpeg")
    print("=" * 60)
    
    tests = [
        test_ffmpeg_installed,
        test_h264_codec,
        test_aac_codec,
        test_hls_format,
        test_ffmpeg_conversion,
        test_hls_segmentation
    ]
    
    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f"\n❌ Erreur lors du test {test.__name__}: {e}")
            results.append(False)
    
    # Résumé
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ DES TESTS")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"\n✅ Tests réussis: {passed}/{total}")
    print(f"❌ Tests échoués: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 Tous les tests sont passés ! FFmpeg est prêt à l'emploi.")
        sys.exit(0)
    else:
        print("\n⚠️ Certains tests ont échoué. Vérifiez l'installation de FFmpeg.")
        sys.exit(1)

if __name__ == "__main__":
    main()
