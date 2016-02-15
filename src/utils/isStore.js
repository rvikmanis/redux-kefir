export default function isStore(object) {
  return (
    typeof object === "object" &&
    typeof object.subscribe === "function" &&
    typeof object.getState === "function"
  )
}
