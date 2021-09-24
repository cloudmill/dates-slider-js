window.addEventListener('load', () => {
  const sliders = document.querySelectorAll('.slider')

  if (sliders.length) {
    const DUPLICATE_COUNT = 3
    const SLIDE_ACTIVE_CLASS = 'slider__slide--active'

    function initIndexes(slides) {
      slides.forEach((slide, index) => slide.setAttribute('data-slide-index', index))
    }
    function addDuplicate(wrapper, slides) {
      for (let i = 0; i < DUPLICATE_COUNT; i++) {
        for (let j = 0; j < slides.length; j++) {
          wrapper.prepend(slides[slides.length - j - 1].cloneNode(true))
          wrapper.append(slides[j].cloneNode(true))
        }
      }
    }
    function calcSize(wrapper, slide) {
      const slideClone = slide.cloneNode(true)

      slideClone.style.position = 'fixed'
      slideClone.style.top = '100%'
      slideClone.style.left = '100%'

      slideClone.classList.remove(SLIDE_ACTIVE_CLASS)
      
      wrapper.append(slideClone)

      const slideRect = slideClone.getBoundingClientRect()
      const slideWidth = slideRect.width

      slideClone.remove()

      return slideWidth
    }
    function calcSizes(wrapper, slides) {
      const sizes = []

      slides.forEach(slide => sizes.push(calcSize(wrapper, slide)))

      return sizes
    }
    function calcGap(wrapper, slides) {
      const slide = slides[0]
      const slideClone = slide.cloneNode(true)

      slideClone.style.position = 'fixed'
      slideClone.style.top = '100%'
      slideClone.style.left = '100%'

      wrapper.append(slideClone)

      const slideStyle = getComputedStyle(slideClone)
      const slideMarginRight = slideStyle.marginRight

      slideClone.remove()
      
      return +slideMarginRight.slice(0, -2)
    }
    function getDist(moveWrapper, slide, sizes, gap) {
      const slides = moveWrapper.children

      let i = 0
      let dist = 0
      while (slides[i] !== slide) {
        dist += gap
        dist += sizes[i % sizes.length]

        i++
      }

      return dist
    }
    function getPosition(wrapper, slide) {
      let i = 0
      while (wrapper.children[i] !== slide) {
        i++
      }

      return Math.ceil((i + 1) / (wrapper.children.length / (DUPLICATE_COUNT * 2 + 1)))
    }

    sliders.forEach(slider => {
      const alignWrapper = slider.querySelector('.slider__wrapper--align')
      const moveWrapper = slider.querySelector('.slider__wrapper--move')
      const slides = slider.querySelectorAll('.slider__slide')
      let sizes
      let gap
      let startIndex = 0  
      let enabled = true
      let path = []

      initIndexes(slides)
      addDuplicate(moveWrapper, slides) 
      sizes = calcSizes(moveWrapper, slides)
      gap = calcGap(moveWrapper, slides)
      slides[startIndex].classList.add(SLIDE_ACTIVE_CLASS)
      moveWrapper.style.transform = `translateX(-${getDist(moveWrapper, slides[startIndex], sizes, gap)}px)`
      alignWrapper.style.transform = `translateX(${sizes[(sizes.length + startIndex - 1) % sizes.length] + gap}px)`
      window.addEventListener('resize', () => {
        sizes = calcSizes(moveWrapper, slides)
        gap = calcGap(moveWrapper, slides)

        moveWrapper.style.transform = `translateX(-${getDist(moveWrapper, moveWrapper.querySelector('.' + SLIDE_ACTIVE_CLASS), sizes, gap)}px)`
        alignWrapper.style.transform = `translateX(${sizes[(sizes.length + +moveWrapper.querySelector('.' + SLIDE_ACTIVE_CLASS).previousElementSibling.getAttribute('data-slide-index')) % sizes.length] + gap}px)`
      })
      for (let slide of moveWrapper.children) {
        slide.addEventListener('click', () => {
          if (enabled) {
            enabled = false
            
            moveWrapper.querySelector('.' + SLIDE_ACTIVE_CLASS).classList.remove(SLIDE_ACTIVE_CLASS)
            slide.classList.add(SLIDE_ACTIVE_CLASS)

            moveWrapper.style.transform = `translateX(-${getDist(moveWrapper, slide, sizes, gap)}px)`
            alignWrapper.style.transform = `translateX(${sizes[(sizes.length + +slide.previousElementSibling.getAttribute('data-slide-index')) % sizes.length] + gap}px)`

            moveWrapper.addEventListener('transitionend', () => {
              const position = getPosition(moveWrapper, moveWrapper.querySelector('.' + SLIDE_ACTIVE_CLASS))


              if (position !== DUPLICATE_COUNT + 1) {
                const dist = Math.abs((DUPLICATE_COUNT + 1) - position)

                for (let i = 0; i < dist; i++) {
                  for (let j = 0; j < slides.length; j++) {
                    if (position < (DUPLICATE_COUNT + 1)) {
                      moveWrapper.prepend(moveWrapper.lastElementChild)
                    } else {
                      moveWrapper.append(moveWrapper.firstElementChild)
                    }
                  }
                }

                moveWrapper.style.transition = 'none'
                moveWrapper.style.transform = `translateX(-${getDist(moveWrapper, slide, sizes, gap)}px)`
                setTimeout(() => moveWrapper.style.transition = '')
              }

              enabled = true
            }, {
              once: true,
            })
          }
        })
      }
    })
  }
})
