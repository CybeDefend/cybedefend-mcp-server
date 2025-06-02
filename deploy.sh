#!/usr/bin/env bash

# TODO Before running :
# - export GHCR_PAT="ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
# - export GHCR_USER="julienzammit" # optional, default is julienzammit

set -euo pipefail

# -----------------------------------------------------------------------------
# ⚙️  CONFIGURATION
# -----------------------------------------------------------------------------
# Nom de l’image locale résultante (par exemple : cybedefend/mcp-server:0.1.3)
IMAGE_LOCAL="cybedefend/mcp-server:0.1.3"

# Nom complet sur GHCR (organization “cybedefend” dans cet exemple) :
IMAGE_GHCR="ghcr.io/cybedefend/cybedefend-mcp-server:0.1.3"

# Chemin vers le Dockerfile (par défaut, le dossier courant)
BUILD_CONTEXT="."

# -----------------------------------------------------------------------------
# 🛠  PRÉREQUIS
# -----------------------------------------------------------------------------
# - Vous devez exportez auparavant votre PAT GitHub (avec scope “packages: write”)
#   dans l’environnement, par exemple :
#
#     export GHCR_PAT="ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
#
# - Si vous poussez dans une organisation (ici “cybedefend”), 
#   le PAT doit être fine‐grained (Resource owner = cybedefend) 
#   avec “Packages → Write” autorisé, et validé via SSO si nécessaire.
# -----------------------------------------------------------------------------

if [[ -z "${GHCR_PAT:-}" ]]; then
  echo "❌ Erreur : la variable d’environnement GHCR_PAT n’est pas définie."
  echo "   export GHCR_PAT=\"ghp_…\" (avec les scopes Packages: write sur l’org cybedefend)"
  exit 1
fi

# -----------------------------------------------------------------------------
# 🚧  1) Build de l’image locale
# -----------------------------------------------------------------------------
echo "🛠  Build de l’image Docker locale : ${IMAGE_LOCAL}"
docker build -t "${IMAGE_LOCAL}" "${BUILD_CONTEXT}"

# -----------------------------------------------------------------------------
# 🔐  2) Docker login sur GHCR
# -----------------------------------------------------------------------------
#    - On utilise le PAT ($GHCR_PAT) pour s’authentifier.
#    - Le nom d’utilisateur peut être votre login GitHub (ici “julienzammit”), 
#      **mais** pour pousser dans l’org “cybedefend” le PAT doit avoir 
#      été généré pour l’organisation “cybedefend”.
#
echo "🔐  Connexion à ghcr.io…"
echo "${GHCR_PAT}" | docker login ghcr.io -u "${GHCR_USER:-julienzammit}" --password-stdin

# -----------------------------------------------------------------------------
# 🏷  3) Tagger l’image
# -----------------------------------------------------------------------------
echo "🏷  Tag de l’image pour GHCR : ${IMAGE_GHCR}"
docker tag "${IMAGE_LOCAL}" "${IMAGE_GHCR}"

# -----------------------------------------------------------------------------
# 🚀  4) Push sur GHCR
# -----------------------------------------------------------------------------
echo "🚀  Push vers GHCR : ${IMAGE_GHCR}"
docker push "${IMAGE_GHCR}"

echo "✅  Push terminé !"
