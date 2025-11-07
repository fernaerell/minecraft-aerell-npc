NAME="aerell-npc"

BP_DIR_PATH="addon/behavior"
RP_DIR_PATH="addon/resource"
DEV_BP_DIR_PATH="C:/Users/$(whoami)/AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang/development_behavior_packs"
DEV_RP_DIR_PATH="C:/Users/$(whoami)/AppData/Roaming/Minecraft Bedrock/Users/Shared/games/com.mojang/development_resource_packs"

BP_DIR_PATH_DEST="$DEV_BP_DIR_PATH/$NAME"
RP_DIR_PATH_DEST="$DEV_RP_DIR_PATH/$NAME"

SCRIPT_DIR_PATH="addon/scripts"
SCRIPT_DIR_PATH_DEST="$BP_DIR_PATH/scripts"

cd $SCRIPT_DIR_PATH

bun build main.ts \
  --outfile ../behavior/scripts/main.js \
  --bundle \
  --target node \
  --minify \
  --external @minecraft/server \
  --external @minecraft/server-ui

cd ../../

if [[ ! -d "$DEV_BP_DIR_PATH" || ! -d "$DEV_RP_DIR_PATH" ]]; then
    echo "Development behavior or resource pack folder not exist."
fi

if [ -d "$BP_DIR_PATH_DEST" ]; then
    rm -r "$BP_DIR_PATH_DEST"
fi

if [ -d "$RP_DIR_PATH_DEST" ]; then
    rm -r "$RP_DIR_PATH_DEST"
fi

cp -r $BP_DIR_PATH "$BP_DIR_PATH_DEST"
cp -r $RP_DIR_PATH "$RP_DIR_PATH_DEST"