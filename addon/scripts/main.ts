import {
    type CustomCommand,
    type CustomCommandResult,
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandOrigin,
    CustomCommandStatus,
    Player,
    system,
    world,
} from '@minecraft/server';

import {
    ActionFormData,
} from '@minecraft/server-ui';

const NAME = 'Aerell NPC';
const IDENTIFIER_PREFIX = 'aerell';
const VERSION = '1.0.0';

const NPC = 'npc';

const NPC_COMMAND_NAME = `${IDENTIFIER_PREFIX}:${NPC}`;
const NPC_COMMAND_ENUM_PREFIX_NAME = `${IDENTIFIER_PREFIX}:prefix`;

const NPC_ENTITY_TYPE_ID = NPC_COMMAND_NAME;

const npcCommand: CustomCommand = {
    name: NPC_COMMAND_NAME,
    description: 'Aerell NPC Commands',
    permissionLevel: CommandPermissionLevel.Any,
    cheatsRequired: false,
    mandatoryParameters: [
        {
            name: NPC_COMMAND_ENUM_PREFIX_NAME,
            type: CustomCommandParamType.Enum
        }
    ]
};

const npcCommandCallBack = (origin: CustomCommandOrigin, prefix: string): CustomCommandResult => {
    const source = origin.initiator ?? origin.sourceEntity;

    if (!(source instanceof Player)) return {
        status: CustomCommandStatus.Failure,
        message: 'This command can only be executed by players.'
    };

    if (prefix == 'version') return {
        status: CustomCommandStatus.Success,
        message: `§e${NAME} version ${VERSION}`
    };

    return {
        status: CustomCommandStatus.Failure
    };
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum(NPC_COMMAND_ENUM_PREFIX_NAME, ['version']);
    event.customCommandRegistry.registerCommand(npcCommand, npcCommandCallBack);
});

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    const itemStack = event.itemStack;
    const player = event.player;
    const target = event.target;
    if (target.typeId == NPC_ENTITY_TYPE_ID && (itemStack?.typeId ?? '') != 'minecraft:name_tag') {
        new ActionFormData()
            .title('Aerell NPC - Menu')
            .label(`Name: ${target.nameTag}`)
            .label(`Health: ${target.getComponent('minecraft:health')?.currentValue}`)
            .show(player).then((value) => {
                if (value.canceled) return;
            });
    }
});