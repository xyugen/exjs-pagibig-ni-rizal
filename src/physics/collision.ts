import * as ex from "excalibur";

enum Category {
  Ground =        0b0000_0001, // prettier-ignore
  Player =        0b0000_0010, // prettier-ignore
}

export const CollisionGroup = {
  Ground: new ex.CollisionGroup(
    "ground",
    Category.Ground,
    collideWith(Category.Player)
  ),
  Player: new ex.CollisionGroup(
    "player",
    Category.Player,
    collideWith(Category.Ground)
  ),
};

/**
 * Combine multiple categories into a single bitmask
 */
function collideWith(...categories: Category[]) {
  return categories.reduce((acc, cat) => acc | cat, 0);
}
