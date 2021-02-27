/**
 * Reusable Toggle Component
 * @author Prashant Chuaudhari <prashantchaudhari@jump360.me>
 */

import { useState } from "react";

/** destructure the children from props */
export default function useToggle() {
  const [on, toggle] = useState(false);

  const handleToggle = () => toggle(!on);

  return {
    on,
    toggle: handleToggle,
  };

  /**
   * Render props pattern
   * render children as a function so we can access parameters in the wrapped component
   */
  // return children({
  //   on,
  //   toggle: handleToggle
  // })
}
