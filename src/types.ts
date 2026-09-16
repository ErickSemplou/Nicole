export type DayStageId = 'morning' | 'bus' | 'kindergarten' | 'park' | 'cafe' | 'home';
export type GrandmaStageId = 'chickens' | 'plants' | 'cats' | 'mushrooms' | 'puddles';
export type GrandpaStageId = 'train' | 'knopka' | 'ducklings' | 'fishing' | 'candies' | 'fence_art' | 'rollers';
export type DanceStageId = 'dance_dressing' | 'dance_warmup' | 'dance_moves' | 'dance_water' | 'dance_performance';
export type StoryId = 'city_day' | 'grandma' | 'grandpa' | 'dance';
export type AppStageId = 'map' | DayStageId | GrandmaStageId | GrandpaStageId | DanceStageId;

export type MorningSubStep = 'wake' | 'teeth' | 'wash_face' | 'breakfast' | 'backpack' | 'dress';
export type BusSubStep = 'ticket' | 'window' | 'drive';
export type KindergartenSubStep = 'greeting' | 'blocks' | 'music' | 'drawing';
export type ParkSubStep = 'scooter' | 'swing' | 'sandbox' | 'sandcastle';
export type CafeSubStep = 'select_donut' | 'decorate_donut' | 'make_cocoa' | 'eat_treats';
export type HomeSubStep = 'unpack' | 'bubble_bath' | 'cozy_pajama' | 'bedtime_story';

export type HairstyleId = 'pigtails_flowers' | 'buns_bows' | 'loose_waves' | 'high_ponytail';
export type OutfitId =
  | 'cherry_dress'
  | 'princess_dress'
  | 'ballerina_dress'
  | 'sport_tracksuit'
  | 'sunny_overalls'
  | 'raincoat'
  | 'cozy_pajama'
  | 'fairy_princess'
  | 'holiday_party'
  | 'sunflower_summer'
  | 'winter_bear'
  | 'superhero_costume'
  | 'mermaid_dress'
  | 'unicorn_onesie'
  | 'chef_outfit'
  | 'snow_queen';

export type ShoeId =
  | 'cherry_shoes'
  | 'princess_heels'
  | 'ballet_slippers'
  | 'yellow_rainboots'
  | 'sport_sneakers'
  | 'winter_boots'
  | 'summer_sandals'
  | 'rainbow_glow_sneakers'
  | 'unicorn_slippers'
  | 'golden_star_boots';

export type EyeColorId = 'sky_blue' | 'emerald_green' | 'warm_hazel' | 'violet';
export type AccessoryId =
  | 'none'
  | 'flower'
  | 'crown'
  | 'heart_glasses'
  | 'cat_ears'
  | 'fairy_wings'
  | 'flower_crown'
  | 'guinea_pig_pin'
  | 'party_hat'
  | 'winter_beanie'
  | 'unicorn_headband'
  | 'superhero_mask'
  | 'magic_star_wand'
  | 'butterfly_clip';

export type KavusiaAccessory =
  | 'none'
  | 'bow'
  | 'flower'
  | 'crown'
  | 'strawberry'
  | 'party_hat'
  | 'sunglasses'
  | 'chef_hat'
  | 'warm_scarf'
  | 'golden_bell'
  | 'fairy_wings'
  | 'detective_hat'
  | 'sleep_cap'
  | 'flower_wreath'
  | 'superhero_cape'
  | 'space_helmet';

// Kavusia Room Decor Types
export type KavusiaWallpaperId = 'meadow' | 'princess_castle' | 'starry_space' | 'lavender_cozy' | 'sweet_bakery';
export type KavusiaBedId = 'soft_hay_bed' | 'pink_velvet_hammock' | 'cloud_fluff' | 'royal_throne';
export type KavusiaHouseId = 'wooden_log_cabin' | 'strawberry_mansion' | 'castle_tower' | 'mushroom_house';
export type KavusiaToyId = 'wooden_tunnel' | 'rainbow_tunnel' | 'mini_swing' | 'running_wheel_safe' | 'chew_ball';
export type KavusiaDishId = 'golden_carrot_bowl' | 'crystal_dropper' | 'snack_basket';
export type KavusiaExtraDecorId = 'disco_ball' | 'fairy_lights' | 'sunflower_pot' | 'nicole_photo_frame';

export interface KavusiaRoomState {
  wallpaper: KavusiaWallpaperId;
  bed: KavusiaBedId;
  house: KavusiaHouseId;
  toy: KavusiaToyId;
  dish: KavusiaDishId;
  extraDecor: KavusiaExtraDecorId;
}

export const DEFAULT_KAVUSIA_ROOM: KavusiaRoomState = {
  wallpaper: 'meadow',
  bed: 'pink_velvet_hammock',
  house: 'wooden_log_cabin',
  toy: 'rainbow_tunnel',
  dish: 'golden_carrot_bowl',
  extraDecor: 'disco_ball',
};

export interface NicoleAppearance {
  hairstyle: HairstyleId;
  outfit: OutfitId;
  eyeColor: EyeColorId;
  accessory: AccessoryId;
  shoes?: ShoeId;
}

export interface Sticker {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  stage: DayStageId;
  description: string;
}

export interface GameProgress {
  completedStages: Record<DayStageId, boolean>;
  starsCount: number;
  unlockedStickers: string[];
  appearance: NicoleAppearance;
}
