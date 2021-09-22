window.addEventListener('DOMContentLoaded', () => {
  const components = document.querySelectorAll('.slider')

  components.forEach(component => {
    // data
    const SLIDE_ACTIVE_CLASS = 'slider__slide--active'
    const SLIDE_DUPLICATE_CLASS = 'slider__slide--duplicate'

    let wrapper
    let slides

    let activeIndex

    let duplicateCount
    
    let slideSizes
    let gap

    // methods
    // *in progress*
    function setActive(index) {
      const activeSlide = component.querySelector('.' + SLIDE_ACTIVE_CLASS)

      try {
        activeSlide.classList.remove(SLIDE_ACTIVE_CLASS)
      } catch (error) {
        console.log(error)
      }

      try {
        component.querySelector(`[data-slide-index="${index}"]`).classList.add(SLIDE_ACTIVE_CLASS)
      } catch (error) {
        console.log(error)
      }
    }

    function initIndexes() {
      slides.forEach((slide, index) => {
        slide.setAttribute('data-slide-index', index)
      })
    }

    function initData() {
      wrapper = component.querySelector('.slider__wrapper')
      slides = component.querySelectorAll('.slider__slide')

      activeIndex = 1

      duplicateCount = 2
    }

    function getDuplicate(slide) {
      const duplicate = slide.cloneNode(true)
      duplicate.classList.add(SLIDE_DUPLICATE_CLASS)
      return duplicate
    }

    function addDuplicate(count) {
      for (let i = 0; i < count; i++) {
        for (let i = 0; i < slides.length; i++) {
          wrapper.prepend(getDuplicate(slides[slides.length - i - 1]))
          wrapper.append(getDuplicate(slides[i]))
        }
      }
    }

    function startInit() {
      initData()

      initIndexes()

      addDuplicate(duplicateCount)

      slides[activeIndex].classList.add(SLIDE_ACTIVE_CLASS) 
    }

    function getWidth(element) {
      const rect = element.getBoundingClientRect()

      return rect.width
    }

    function updateSizeData() {
      gap = getComputedStyle(slides[0]).marginRight.slice(0, -2)

      slideSizes = []

      slides.forEach(slide => {
        const slideSize = {}

        const slideCopy = slide.cloneNode(true)

        slideCopy.style.position = 'fixed'
        slideCopy.style.top = '100%'
        slideCopy.style.left = '100%'

        slideCopy.classList.remove(SLIDE_ACTIVE_CLASS)
        wrapper.append(slideCopy)
        slideSize.default = getWidth(slideCopy)
        slideCopy.remove()

        slideCopy.classList.add(SLIDE_ACTIVE_CLASS)
        wrapper.append(slideCopy)
        slideSize.active = getWidth(slideCopy)
        slideCopy.remove()

        slideSizes.push(slideSize)
      })
    }

    function updateWrapperPos() {
      let dist = 0

      dist += gap * slides.length * duplicateCount
      dist += gap * activeIndex

      dist += slideSizes.reduce((sum, curSize) => sum + curSize.default, 0) * duplicateCount
      dist += (() => {
        let dist = 0

        for (let i = 0; i < activeIndex; i++) {
          dist += slideSizes[i].default
        }

        return dist
      })()

      wrapper.style.transform = `translateX(-${dist}px)`
    }

    function left() {
      let dist = 0

      dist += gap * slides.length * duplicateCount

      dist += slideSizes.reduce((sum, curSize) => sum + curSize.default, 0) * duplicateCount

      dist -= gap
      dist -= slideSizes[slides.length - 1].default

      wrapper.style.transform = `translateX(-${dist}px)`

      wrapper.addEventListener('transitionend', () => {
        
      })
    }

    // events
    startInit()

    window.addEventListener('load', () => {
      updateSizeData()
      updateWrapperPos()
    })
    
    window.addEventListener('resize', () => {
      updateSizeData()
      updateWrapperPos()
    })

    component.addEventListener('click', event => {
      const target = event.target

      const targetSlide = target.closest('.slider__slide')

      if (targetSlide && !targetSlide.classList.contains(SLIDE_ACTIVE_CLASS)) {
        activeIndex = +targetSlide.getAttribute('data-slide-index')

        component.querySelector('.slider__slide--active').classList.remove(SLIDE_ACTIVE_CLASS)

        if (targetSlide.classList.contains(SLIDE_DUPLICATE_CLASS)) {
          if (activeIndex === (slides.length - 1)) {
            slides[0].previousElementSibling.classList.add(SLIDE_ACTIVE_CLASS)

            left()
          } else {
            
          }
        } else {
          component.querySelector(`[data-slide-index="${activeIndex}"]:not(.slider__slide--duplicate)`).classList.add(SLIDE_ACTIVE_CLASS)
  
          updateWrapperPos()
        }
      }
    })
  })
})