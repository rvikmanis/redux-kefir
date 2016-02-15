export default function isStore(object) {
  return (
    typeof object === "object" &&
    object !== null &&
    typeof object.subscribe === "function" &&
    typeof object.getState === "function"
  )
}
