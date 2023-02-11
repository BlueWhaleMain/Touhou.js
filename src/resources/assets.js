import {newImage} from "./images";
import {AUDIO_TYPE, newAudio, VOLUME_MAX} from "./sounds";
import {newText} from "./texts";
import {resources} from "./manager";

const DESCRIPTION_PREFIX = 'description/';

export const ASSETS = {
    IMAGE: {
        rumia: newImage(resources.Images.bossRumia),
        hakureiReimu: newImage(resources.Images.player.hakureiReimu),
        bossHakureiReimu: newImage(resources.Images.bossHakureiReimu),
        kirisameMarisa: newImage(resources.Images.player.kirisameMarisa),
        bossKirisameMarisa: newImage(resources.Images.bossKirisameMarisa),
        patchouliKnowledge: newImage(resources.Images.bossPatchouliKnowledge),
        yukariYakumo: newImage(resources.Images.bossYukariYakumo)
    },
    SOUND: {
        aSoulAsScarletAsAgroundCherry: {
            head: newAudio(resources.Sounds.aSoulAsScarletAsAgroundCherry.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.aSoulAsScarletAsAgroundCherry.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.aSoulAsScarletAsAgroundCherry.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.aSoulAsScarletAsAgroundCherry.description)
        },
        tomboyishLoveGirlInAdventure: {
            head: newAudio(resources.Sounds.tomboyishLoveGirlInAdventure.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.tomboyishLoveGirlInAdventure.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.tomboyishLoveGirlInAdventure.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.tomboyishLoveGirlInAdventure.description)
        },
        tomboyishGirlInLove: {
            head: newAudio(resources.Sounds.tomboyishGirlInLove.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.tomboyishGirlInLove.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.tomboyishGirlInLove.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.tomboyishGirlInLove.description)
        },
        illusionaryNightGhostlyEyes: {
            head: newAudio(resources.Sounds.illusionaryNightGhostlyEyes.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.illusionaryNightGhostlyEyes.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.illusionaryNightGhostlyEyes.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.illusionaryNightGhostlyEyes.description)
        },
        stirringAnAutumnMoonMoonedInsect: {
            head: newAudio(resources.Sounds.stirringAnAutumnMoonMoonedInsect.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.stirringAnAutumnMoonMoonedInsect.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.stirringAnAutumnMoonMoonedInsect.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.stirringAnAutumnMoonMoonedInsect.description)
        },
        aMaidensIllusionaryFuneralNecroFantasy: {
            head: newAudio(resources.Sounds.aMaidensIllusionaryFuneralNecroFantasy.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.aMaidensIllusionaryFuneralNecroFantasy.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.aMaidensIllusionaryFuneralNecroFantasy.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.aMaidensIllusionaryFuneralNecroFantasy.description)
        },
        spiritualDominationWhoDoneIt: {
            head: newAudio(resources.Sounds.spiritualDominationWhoDoneIt.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.spiritualDominationWhoDoneIt.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.spiritualDominationWhoDoneIt.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.spiritualDominationWhoDoneIt.description)
        },
        easternNight: {
            head: newAudio(resources.Sounds.easternNight.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.easternNight.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.easternNight.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.easternNight.description)
        },
        th10_01: {
            head: newAudio(resources.Sounds.th10_01.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.th10_01.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.th10_01.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.th10_01.description)
        },
        easternNightPractice: {
            head: newAudio(resources.Sounds.easternNightPractice.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.easternNightPractice.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.easternNightPractice.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.easternNightPractice.description)
        },
        failure: {
            head: newAudio(resources.Sounds.failure.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.failure.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.failure.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.failure.description)
        },
        rumia: {
            head: newAudio(resources.Sounds.rumia.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.rumia.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.rumia.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.rumia.description)
        },
        patchouliKnowledge: {
            head: newAudio(resources.Sounds.patchouliKnowledge.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.patchouliKnowledge.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.patchouliKnowledge.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.patchouliKnowledge.description)
        },
        hakureiReimu: {
            head: newAudio(resources.Sounds.hakureiReimu.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.hakureiReimu.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.hakureiReimu.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.hakureiReimu.description)
        },
        kirisameMarisa: {
            head: newAudio(resources.Sounds.kirisameMarisa.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.kirisameMarisa.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.kirisameMarisa.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.kirisameMarisa.description)
        },
        yukariYakumo: {
            head: newAudio(resources.Sounds.yukariYakumo.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.yukariYakumo.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.yukariYakumo.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.yukariYakumo.description)
        },
        th095_02: {
            head: newAudio(resources.Sounds.th095_02.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.th095_02.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.th095_02.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.th095_02.description)
        },
        th095_04: {
            head: newAudio(resources.Sounds.th095_04.head, VOLUME_MAX, AUDIO_TYPE.BGM),
            loop: newAudio(resources.Sounds.th095_04.loop, VOLUME_MAX, AUDIO_TYPE.BGM),
            name: resources.Sounds.th095_04.name,
            description: newText(DESCRIPTION_PREFIX + resources.Sounds.th095_04.description)
        },
        invalid: newAudio(resources.Sounds.invalid),
        ok: newAudio(resources.Sounds.ok)
    }
};
for (const o in ASSETS.SOUND) {
    if (ASSETS.SOUND.hasOwnProperty(o) && ASSETS.SOUND[o].head && resources.Sounds[o]) {
        ASSETS.SOUND[o].loopStartDelay = resources.Sounds[o].loopStartDelay;
        ASSETS.SOUND[o].loopLoopDelay = resources.Sounds[o].loopLoopDelay;
        ASSETS.SOUND[o].key = o;
    }
}