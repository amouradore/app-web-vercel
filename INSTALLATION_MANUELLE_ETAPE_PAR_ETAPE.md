# INSTALLATION CLOUDFLARE TUNNEL - ETAPE PAR ETAPE

## IMPORTANT : N'utilisez PAS les scripts .ps1 (ils ont des problemes d'encodage)

## SUIVEZ CES ETAPES MANUELLEMENT

---

## Etape 1 : Ouvrir PowerShell en Administrateur

1. Cliquez sur le menu Demarrer
2. Tapez "PowerShell"
3. Clic droit sur "Windows PowerShell"
4. Selectionnez "Executer en tant qu'administrateur"

---

## Etape 2 : Creer le dossier cloudflared

Tapez cette commande et appuyez sur Entree :

```
New-Item -ItemType Directory -Force -Path "C:\cloudflared"
```

Resultat attendu : "Directory: C:\" et "cloudflared"

---

## Etape 3 : Aller dans le dossier

```
cd C:\cloudflared
```

---

## Etape 4 : Telecharger cloudflared.exe (1-2 minutes)

```
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"
```

ATTENDEZ que le telechargement se termine (barre de progression)

---

## Etape 5 : Verifier que le fichier existe

```
dir cloudflared.exe
```

Vous devriez voir le fichier (environ 40-50 MB)

---

## Etape 6 : Se connecter a Cloudflare

```
.\cloudflared.exe tunnel login
```

UNE PAGE WEB VA S'OUVRIR :
- Connectez-vous a votre compte Cloudflare (ou creez-en un)
- Cliquez sur "Authorize" (Autoriser)
- Revenez a PowerShell

Resultat attendu : "You have successfully logged in"

---

## Etape 7 : Creer le tunnel

```
.\cloudflared.exe tunnel create iptv-app
```

NOTEZ LE TUNNEL ID AFFICHE (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

Exemple : abc12345-6789-1234-5678-123456789abc

---

## Etape 8 : Verifier le tunnel

```
.\cloudflared.exe tunnel list
```

Vous devriez voir votre tunnel "iptv-app"

---

## Etape 9 : Creer le fichier config.yml

REMPLACEZ les valeurs ci-dessous :
- TUNNEL-ID-ICI : le tunnel ID note a l'etape 7
- VOTRE-NOM-UTILISATEUR : votre nom d'utilisateur Windows (probablement "DELL")

```
@"
tunnel: TUNNEL-ID-ICI
credentials-file: C:\Users\VOTRE-NOM-UTILISATEUR\.cloudflared\TUNNEL-ID-ICI.json

ingress:
  - service: http://localhost:8000
"@ | Out-File -FilePath "config.yml" -Encoding UTF8
```

EXEMPLE CONCRET (remplacez les valeurs) :
```
@"
tunnel: abc12345-6789-1234-5678-123456789abc
credentials-file: C:\Users\DELL\.cloudflared\abc12345-6789-1234-5678-123456789abc.json

ingress:
  - service: http://localhost:8000
"@ | Out-File -FilePath "config.yml" -Encoding UTF8
```

---

## Etape 10 : Verifier config.yml

```
Get-Content config.yml
```

Vous devriez voir le contenu du fichier avec votre tunnel ID

---

## INSTALLATION TERMINEE !

Cloudflare Tunnel est maintenant installe.

PROCHAINE ETAPE : Demarrer le serveur

Revenez me dire quand c'est fait et nous lancerons le serveur !

---

## EN CAS DE PROBLEME

Si vous avez une erreur a une etape, ARRETEZ et dites-moi :
1. Quel numero d'etape ?
2. Quelle est l'erreur affichee ?

Je vous aiderai a resoudre le probleme.
