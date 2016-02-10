export default function isStore(object) {
  return (
    object != null &&
    typeof object.subscribe === "function" &&
    typeof object.getState === "function"
  )
}
