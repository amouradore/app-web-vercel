# Installation du CLI Render Officiel

## 📥 Étape 1 : Téléchargement

Le CLI officiel de Render a été lancé en décembre 2024. Voici comment l'installer sur Windows :

### Méthode 1 : Téléchargement manuel (Recommandé)

1. **Ouvrez la page des releases** :
   - URL : https://github.com/render-oss/cli/releases/latest
   - Cette page devrait s'être ouverte automatiquement dans votre navigateur

2. **Téléchargez le fichier Windows** :
   - Cherchez le fichier : `render-windows-amd64.exe`
   - Cliquez dessus pour le télécharger

3. **Renommez et déplacez le fichier** :
   ```powershell
   # Renommez le fichier téléchargé
   Rename-Item -Path "$env:USERPROFILE\Downloads\render-windows-amd64.exe" -NewName "render.exe"
   
   # Déplacez-le dans votre dossier de projet
   Move-Item -Path "$env:USERPROFILE\Downloads\render.exe" -Destination "C:\Users\DELL\Desktop\git\app2\render.exe"
   ```

### Méthode 2 : Installation globale (Optionnel)

Pour utiliser `render` depuis n'importe quel dossier :

1. Créez un dossier pour vos outils CLI :
   ```powershell
   New-Item -ItemType Directory -Path "C:\CLI-Tools" -Force
   ```

2. Déplacez `render.exe` dans ce dossier :
   ```powershell
   Move-Item -Path "$env:USERPROFILE\Downloads\render.exe" -Destination "C:\CLI-Tools\render.exe"
   ```

3. Ajoutez ce dossier à votre PATH :
   ```powershell
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\CLI-Tools", "User")
   ```

4. Redémarrez votre terminal PowerShell

## ✅ Étape 2 : Vérification de l'installation

Testez que le CLI fonctionne :

```powershell
# Si vous avez installé localement dans le projet
.\render.exe

# Si vous avez installé globalement
render
```

Vous devriez voir le menu d'aide du CLI Render.

## 🔐 Étape 3 : Authentification

Une fois installé, connectez-vous à votre compte Render :

```powershell
# Si installation locale
.\render.exe login

# Si installation globale
render login
```

Cette commande :
1. Ouvrira votre navigateur
2. Vous demandera de vous connecter à Render
3. Générera un token CLI
4. Sauvegardera le token localement

## 🚀 Étape 4 : Commandes courantes

### Déployer un service
```powershell
render deploy
```

### Voir les logs
```powershell
render logs
```

### Lister vos services
```powershell
render services list
```

### Redémarrer un service
```powershell
render services restart
```

### Ouvrir une session psql (pour les bases de données)
```powershell
render psql
```

## 📚 Documentation officielle

- Documentation CLI : https://render.com/docs/cli
- GitHub du projet : https://github.com/render-oss/cli
- Releases : https://github.com/render-oss/cli/releases

## ⚠️ Notes importantes

1. **Ne PAS utiliser `render-cli` de npm** - C'est un package tiers obsolète qui ne fonctionne pas
2. **Le CLI officiel est très récent** - Lancé en décembre 2024
3. **Nécessite un compte Render** - Créez-en un gratuitement sur https://render.com

## 🆘 Dépannage

### Erreur "render n'est pas reconnu"
- Vérifiez que le fichier est bien nommé `render.exe`
- Utilisez `.\render.exe` si vous êtes dans le même dossier
- Ou ajoutez le dossier au PATH

### Problème d'authentification
- Assurez-vous d'avoir un compte Render actif
- Vérifiez que votre navigateur peut s'ouvrir automatiquement
- Essayez de vous connecter manuellement sur https://render.com d'abord
