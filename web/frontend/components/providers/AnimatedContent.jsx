import React, { useEffect } from 'react';

async function AnimatedContent(ref, animation, options = {}) {
console.log('options', animation)
  const {
    duration = 0.4,
    prefix = "animate__",
    iterationCount = 1,
    direction = "normal",
    fillMode = "both",
    timingFunction = "linear",
    onComplete = () => {
       
    },
  } = options;

  return await new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;

    ref.current.style.setProperty("--animate-duration", `${duration}s`);
    ref.current.style.setProperty("--animate-iteration-count", iterationCount);
    ref.current.style.setProperty("--animate-direction", direction);
    ref.current.style.setProperty("--animate-fill-mode", fillMode);
    ref.current.style.setProperty("--animate-timing-function", timingFunction);

    ref.current.classList.add(`${prefix}animated`, animationName);


    async function handleAnimationEnd(event) {
      event.stopPropagation();
      ref.current.classList.remove(`${prefix}animated`, animationName);
   
      onComplete();
      console.log('hit animation')
      resolve("Animation ended");
    }

    ref.current.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  });
}

export {AnimatedContent};




/*  
animate.css provides a variety of timing functions that you can use to control the easing and timing of CSS animations. These timing functions can be applied to your animations to achieve different effects. Here are some of the timing functions provided by animate.css:

    Ease-In (easing-in animations at the beginning of the animation):
        easeIn
        easeInDown
        easeInUp
        easeInLeft
        easeInRight

    Ease-Out (easing-out animations at the end of the animation):
        easeOut
        easeOutDown
        easeOutUp
        easeOutLeft
        easeOutRight

    Ease-In-Out (easing in and out during the animation):
        easeInOut
        easeInOutDown
        easeInOutUp
        easeInOutLeft
        easeInOutRight

    Linear (constant animation speed):
        linear

    Ease (default easing):
        ease

    Bounce (creates a bouncing effect):
        bounce
        bounceIn
        bounceOut
        bounceInUp
        bounceOutDown

    Elastic (creates a rubbery or spring-like effect):
        elastic
        rubberBand

    Swing (simulates a swinging motion):
        swing

    Wobble (creates a wobbling effect):
        wobble
        wobbleHorizontal
        wobbleVertical

    Hinge (simulates a door hinge effect):
        hinge












        In CSS animations and transitions, the fill-mode property controls what happens before and after an animation's execution. animate.css provides a few options for controlling this aspect of animations. Here are the common fill modes used in CSS animations and transitions:

    None (Default):
        This is the default fill mode. It means there's no special handling before or after the animation. The element retains its initial styles before and after the animation.

    Forwards:
        In this fill mode, the element retains the computed values of the final keyframe after the animation is complete. This is often used to keep the element in its final state after the animation finishes.

    Backwards:
        In this fill mode, the element is styled with the computed values of the first keyframe (start state) before the animation begins. It's like applying the animation's initial styles even before it starts.

    Both:
        This combines both forwards and backwards behavior. The element will have the styles of the first keyframe before the animation starts and retain the styles of the final keyframe after it's complete.

In animate.css, you can control the fill mode by adding appropriate class names to your elements:

    animate__animated animate__fill-none: This is the default behavior with no special fill mode.
    animate__animated animate__fill-forwards: Applies the forwards fill mode.
    animate__animated animate__fill-backwards: Applies the backwards fill mode.
    animate__animated animate__fill-both: Applies both fill mode.

Here's an example of how to use these classes with animate.css:

html

<div class="animate__animated animate__bounce animate__fill-forwards">Bouncing Element</div>

In this example, the element will retain the final styles of the animation (forwards) after it completes.

Remember that the actual behavior may depend on how you've configured your animation and how your CSS styles are structured, so it's always a good practice to test and verify the results when using different fill modes in your animations.
*/