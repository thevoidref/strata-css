/* scripts/motion.js */

const MOTION_SELECTOR  =  ".motion[data-motion]";
const GROUP_SELECTOR   =  ".motion-group[data-motion-trigger]";
const TRIGGER_SELECTOR =  "[data-motion-trigger]:not(.motion-group)"; // 1. Find wrappers
const FRAME_BUFFER =      34;

const DEFAULT_OBSERVER_OPTIONS = {
  root:       null,
  rootMargin: "0px 0px -20% 0px",
  threshold:  0.20,
};

/* -------------------------------------------------------------------------- */
/* Time & CSS Values (unchanged)                                              */
/* -------------------------------------------------------------------------- */

function toMilliseconds(value) {
  const time = value.trim();
  if (time.endsWith("ms")) return Number.parseFloat(time);
  if (time.endsWith("s")) return Number.parseFloat(time) * 1000;
  return 0;
}

function transitionTime(element) {
  const style     = getComputedStyle(element);
  const durations = style.transitionDuration.split(",");
  const delays    = style.transitionDelay.split(",");
  const count     = Math.max(durations.length, delays.length);
  let longest = 0;

  for (let index = 0; index < count; index += 1) {
    const duration = toMilliseconds(durations[index % durations.length]);
    const delay = toMilliseconds(delays[index % delays.length]);
    longest = Math.max(longest, duration + delay);
  }
  return longest;
}

function customTime(element, property) {
  return toMilliseconds(getComputedStyle(element).getPropertyValue(property));
}

/* -------------------------------------------------------------------------- */
/* Motion Controller                                                          */
/* -------------------------------------------------------------------------- */

export class MotionController {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OBSERVER_OPTIONS, ...options };
    this.observer = null;
    this.targets  = new WeakMap();
    this.timers   = new WeakMap();
    this.ready    = false;
  }

  init() {
    if (this.ready) return this;

    // 2. Grab wrappers and groups, keep elements for fallbacks
    const triggers = [...document.querySelectorAll(TRIGGER_SELECTOR)];
    const groups   = [...document.querySelectorAll(GROUP_SELECTOR)];
    const elements = [...document.querySelectorAll(MOTION_SELECTOR)];

    try {
      this.prepareGroups(groups);
      this.prepareStandalone(triggers); // 3. Pass wrappers instead of elements

      document.documentElement.setAttribute("data-motion-ready", "");
      this.ready = true;

      if (this.prefersReducedMotion()) {
        elements.forEach((element) => this.complete(element));
        return this;
      }

      this.prepareObserver();
      this.registerGroups(groups);
      this.registerStandalone(triggers); // 4. Pass wrappers
    } catch (error) {
      this.observer?.disconnect();
      this.observer = null;
      document.documentElement.removeAttribute("data-motion-ready");

      elements.forEach((element) => {
        element.removeAttribute("data-motion-state");
        element.style.removeProperty("--motion-stagger-delay");
      });

      this.ready = false;
      throw error;
    }

    return this;
  }

  prepareGroups(groups) {
    groups.forEach((group) => {
      const elements = this.groupElements(group);
      const step     = customTime(group, "--motion-stagger");

      elements.forEach((element, index) => {
        element.setAttribute("data-motion-state", "idle");
        element.style.setProperty("--motion-stagger-delay", `${step * index}ms`);
      });

      this.targets.set(group, {
        elements,
        repeat: group.hasAttribute("data-motion-repeat"),
      });
    });
  }

  // 5. Rewritten to look inside the wrapper for .motion elements
  prepareStandalone(triggers) {
    triggers.forEach((trigger) => {
      // Handle legacy cases where the trigger IS the moving element
      const isSelfMotion = trigger.matches(MOTION_SELECTOR);
      
      const elements = isSelfMotion 
        ? [trigger] 
        : [...trigger.querySelectorAll(MOTION_SELECTOR)]
            .filter((el) => el.closest(GROUP_SELECTOR) === null);

      if (elements.length === 0) return;

      elements.forEach((element) => {
        element.setAttribute("data-motion-state", "idle");
      });

      // Map the wrapper (target) to its moving elements
      this.targets.set(trigger, {
        elements,
        repeat: trigger.hasAttribute("data-motion-repeat"),
      });
    });
  }

  prepareObserver() {
    if (!("IntersectionObserver" in window)) return;
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersections(entries),
      this.options
    );
  }

  registerGroups(groups) {
    groups.forEach((group) => this.registerTarget(group, group.dataset.motionTrigger));
  }

  registerStandalone(triggers) {
    triggers.forEach((trigger) => this.registerTarget(trigger, trigger.dataset.motionTrigger));
  }

  registerTarget(target, trigger) {
    const record = this.targets.get(target);
    if (!record) return;

    switch (trigger) {
      case "load":
        this.afterLayout(() => this.activate(target));
        break;
      case "view":
        if (this.observer) this.observer.observe(target);
        else this.activate(target);
        break;
      case "manual":
        break;
      default:
        this.activate(target);
        break;
    }
  }

  handleIntersections(entries) {
    entries.forEach((entry) => {
      const record = this.targets.get(entry.target);
      if (!record) return;

      if (entry.isIntersecting) {
        this.activate(entry.target);
        if (!record.repeat) this.observer.unobserve(entry.target);
        return;
      }

      if (record.repeat) this.reset(entry.target);
    });
  }

  activate(target) {
    const elements = this.resolveElements(target);
    elements.forEach((element) => {
      this.clearTimer(element);
      element.setAttribute("data-motion-state", "active");
      element.dispatchEvent(new CustomEvent("motion:start", { bubbles: true }));

      const timer = window.setTimeout(() => {
        this.complete(element);
      }, transitionTime(element) + FRAME_BUFFER);

      this.timers.set(element, timer);
    });
    return this;
  }

  complete(target) {
    const elements = this.resolveElements(target);
    elements.forEach((element) => {
      this.clearTimer(element);
      element.setAttribute("data-motion-state", "complete");
      element.dispatchEvent(new CustomEvent("motion:complete", { bubbles: true }));
    });
    return this;
  }

  reset(target) {
    const elements = this.resolveElements(target);
    elements.forEach((element) => {
      this.clearTimer(element);
      element.setAttribute("data-motion-state", "idle");
    });
    return this;
  }

  // 6. This existing method naturally supports the wrapper pattern!
  resolveElements(target) {
    if (target.matches?.(MOTION_SELECTOR)) return [target];
    return this.targets.get(target)?.elements ?? [];
  }

  groupElements(group) {
    return [...group.querySelectorAll(MOTION_SELECTOR)]
      .filter((element) => element.closest(GROUP_SELECTOR) === group);
  }

  clearTimer(element) {
    const timer = this.timers.get(element);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      this.timers.delete(element);
    }
  }

  afterLayout(callback) {
    requestAnimationFrame(() => requestAnimationFrame(callback));
  }

  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
}

export const motion = new MotionController();
motion.init();