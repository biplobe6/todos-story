import React from 'react';
import { useFakeTimers } from 'sinon';
import jestMock from 'jest-mock';
import { shallow } from 'enzyme';
import DragNDrop from ".";

const {expect} = global;


const DragNDropSetup = () => {
  const onDragEnterFn = jestMock.fn()
  const onDragLeaveFn = jestMock.fn()
  let renderProps = {
    dragging: undefined,
    dropZoneEnabled: undefined,
    dropZoneHandlers: undefined,
    onDragStartHandler: undefined,
    onDragOverHandler: undefined,
    onDragEnterHandler: undefined,
    onDragLeaveHandler: undefined,
    onDragEndHandler: undefined,
    onDropHandler: undefined,
  }
  const renderCallback = (props) => {
    renderProps = props
    return null
  }
  const wrapper = shallow(
    <DragNDrop
      onDragEnter={onDragEnterFn}
      onDragLeave={onDragLeaveFn}>
      {renderCallback}
    </DragNDrop>
  )
  const instance = wrapper.instance()

  const getRenderProps = () => renderProps

  const dragStartFnWithDelay = () => {
    const clock = useFakeTimers()
    getRenderProps().onDragEnterHandler()
    clock.tick(instance.props.delay)
    clock.reset()
  }

  const dragLeaveFnWithDelay = () => {
    const clock = useFakeTimers()
    getRenderProps().onDragLeaveHandler()
    clock.tick(instance.props.delay)
    clock.reset()
  }

  return ({
    wrapper,
    instance,
    getRenderProps,
    onDragEnterFn,
    onDragLeaveFn,
    dragStartFnWithDelay,
    dragLeaveFnWithDelay,
  })
}


describe('<DragNDrop />', () => {
  describe('State', () => {
    it('Should have property called "dragging"', () => {
      const {instance} = DragNDropSetup();
      expect(instance.state.dragging).not.toBeUndefined()
      expect(instance.state.dragging).toBeFalsy()
    })


    it('Should set "dropZoneEnabled" to true after delay', () => {
      const {instance} = DragNDropSetup();
      expect(instance.state.dropZoneEnabled).not.toBeUndefined()
      expect(instance.state.dropZoneEnabled).toBeFalsy()
      const clock = useFakeTimers()

      instance.onDragEnterHandler()
      expect(instance.state.dropZoneEnabled).toBeFalsy()
      clock.tick(instance.props.delay)
      clock.reset()
      expect(instance.state.dropZoneEnabled).toBeTruthy()
    })


    it('Should not set "dropZoneEnabled" to true after delay', () => {
      const {instance} = DragNDropSetup();
      expect(instance.state.dropZoneEnabled).not.toBeUndefined()
      expect(instance.state.dropZoneEnabled).toBeFalsy()
      const clock = useFakeTimers()

      instance.onDragEnterHandler()
      clock.tick(100)
      instance.onDragLeaveHandler()
      clock.tick(instance.props.delay)
      clock.reset()
      expect(instance.state.dropZoneEnabled).toBeFalsy()
    })
  })


  describe('renderProps', () => {
    describe('dragging', () => {
      it('Should not be undefined', () => {
        const renderProps = DragNDropSetup().getRenderProps()
        expect(renderProps.dragging).not.toBeUndefined()
        expect(renderProps.dragging).toBeFalsy()
      })
    })


    describe('dropZoneEnabled', () => {
      it('Should not be undefined', () => {
        const renderProps = DragNDropSetup().getRenderProps()
        expect(renderProps.dropZoneEnabled).not.toBeUndefined()
        expect(renderProps.dropZoneEnabled).toBeFalsy()
      })
    })


    describe('dropZoneHandlers', () => {
      const dragNdrop = DragNDropSetup()

      it('Should not be undefined', () => {
        const { dropZoneHandlers } = dragNdrop.getRenderProps()
        expect(dropZoneHandlers).not.toBeUndefined()
      })


      it('Should have a property called "onDragOver"', () => {
        const { dropZoneHandlers } = dragNdrop.getRenderProps()
        expect(dropZoneHandlers.onDragOver).not.toBeUndefined()
      })


      it('Should have a property called "onDragEnter"', () => {
        const { dropZoneHandlers } = dragNdrop.getRenderProps()
        expect(dropZoneHandlers.onDragEnter).not.toBeUndefined()
      })


      it('Should have a property called "onDragLeave"', () => {
        const { dropZoneHandlers } = dragNdrop.getRenderProps()
        expect(dropZoneHandlers.onDragLeave).not.toBeUndefined()
      })


      it('Should have a property called "onDrop"', () => {
        const { dropZoneHandlers } = dragNdrop.getRenderProps()
        expect(dropZoneHandlers.onDrop).not.toBeUndefined()
      })
    })


    describe('onDragStartHandler()', () => {
      it('Should not be undefined', () => {
        const dragNdrop = DragNDropSetup()
        const { onDragStartHandler } = dragNdrop.getRenderProps()
        expect(onDragStartHandler).not.toBeUndefined()
      })


      it('Should update "dragging" value to true', () => {
        const { getRenderProps } = DragNDropSetup()
        expect(getRenderProps().dragging).toBeFalsy()
        getRenderProps().onDragStartHandler()
        expect(getRenderProps().dragging).toBeTruthy()
      })
    })


    describe('onDragOverHandler()', () => {
      const dragNdrop = DragNDropSetup()


      it('Should not be undefined', () => {
        const { onDragOverHandler } = dragNdrop.getRenderProps()
        expect(onDragOverHandler).not.toBeUndefined()
      })
    })


    describe('onDragEnterHandler()', () => {
      it('Should not be undefined', () => {
        const { onDragEnterHandler } = DragNDropSetup().getRenderProps()
        expect(onDragEnterHandler).not.toBeUndefined()
      })


      it('Should update value of "dropZoneEnabled" to true', () => {
        const {getRenderProps, instance} = DragNDropSetup();
        expect(getRenderProps().dropZoneEnabled).toBeFalsy()

        const clock = useFakeTimers()
        getRenderProps().onDragEnterHandler()
        clock.tick(instance.props.delay)
        clock.reset()
        expect(getRenderProps().dropZoneEnabled).toBeTruthy()
      })


      it('Should trigger "onDragEnter" with delay', () => {
        const {dragStartFnWithDelay, onDragEnterFn} = DragNDropSetup();

        expect(onDragEnterFn).not.toHaveBeenCalled()
        dragStartFnWithDelay()
        expect(onDragEnterFn).toHaveBeenCalledTimes(1)
      })

      it('Should not trigger "onDragEnter" if gets canceled before delay', () => {
        const {getRenderProps, dragLeaveFnWithDelay, instance, onDragEnterFn, onDragLeaveFn} = DragNDropSetup();

        expect(onDragEnterFn).not.toHaveBeenCalled()

        const clock = useFakeTimers()
        getRenderProps().onDragEnterHandler()
        clock.tick(instance.props.delay / 2)
        clock.reset()

        dragLeaveFnWithDelay()

        expect(onDragEnterFn).not.toHaveBeenCalled()
        expect(instance.onDragEnterId).toBeNull()
        expect(onDragLeaveFn).not.toHaveBeenCalled()
      })


      it('Should not call "onDragEnter" more than once (props callback).', () => {
        const {onDragEnterFn, dragStartFnWithDelay} = DragNDropSetup();
        expect(onDragEnterFn).not.toHaveBeenCalled()
        dragStartFnWithDelay()
        dragStartFnWithDelay()
        dragStartFnWithDelay()
        expect(onDragEnterFn).toHaveBeenCalledTimes(1)
      })


      it('Should not update value of "dropZoneEnabled" if itself is being dragged', () => {
        const {getRenderProps, instance} = DragNDropSetup();
        expect(getRenderProps().dropZoneEnabled).toBeFalsy();

        getRenderProps().onDragStartHandler()
        expect(getRenderProps().dropZoneEnabled).toBeFalsy();

        const clock = useFakeTimers()
        getRenderProps().onDragEnterHandler()
        expect(getRenderProps().dropZoneEnabled).toBeFalsy();
        clock.tick(instance.props.delay)
        clock.reset()
        expect(getRenderProps().dropZoneEnabled).toBeFalsy();
      })
    })


    describe('onDragLeaveHandler()', () => {
      it('Should not be undefined', () => {
        const dragNdrop = DragNDropSetup()
        const { onDragLeaveHandler } = dragNdrop.getRenderProps()
        expect(onDragLeaveHandler).not.toBeUndefined()
      })


      it('Should update (state) dropZoneEnabled to false', () => {
        const { getRenderProps, dragStartFnWithDelay, dragLeaveFnWithDelay } = DragNDropSetup()
        expect(getRenderProps().dropZoneEnabled).toBeFalsy()

        dragStartFnWithDelay()
        expect(getRenderProps().dropZoneEnabled).toBeTruthy()

        dragLeaveFnWithDelay()
        expect(getRenderProps().dropZoneEnabled).toBeFalsy()
      })


      it('Should trigger "onDragLeave" with delay', () => {
        const {onDragEnterFn, onDragLeaveFn, dragStartFnWithDelay, dragLeaveFnWithDelay} = DragNDropSetup();
        expect(onDragEnterFn).not.toHaveBeenCalled()
        expect(onDragLeaveFn).not.toHaveBeenCalled()

        dragStartFnWithDelay()
        expect(onDragEnterFn).toHaveBeenCalledTimes(1)

        dragLeaveFnWithDelay()
        expect(onDragLeaveFn).toHaveBeenCalledTimes(1)
      })


      it('Should not trigger "onDragLeave" if gets canceled before delay', () => {
        const {getRenderProps, instance, dragLeaveFnWithDelay, dragStartFnWithDelay, onDragEnterFn, onDragLeaveFn} = DragNDropSetup();
        expect(onDragEnterFn).not.toHaveBeenCalled()
        expect(onDragLeaveFn).not.toHaveBeenCalled()



        dragStartFnWithDelay()
        expect(onDragEnterFn).toHaveBeenCalledTimes(1)

        const clock = useFakeTimers()
        getRenderProps().onDragLeaveHandler()
        clock.tick(instance.props.delay / 2)
        clock.reset()

        dragStartFnWithDelay()

        expect(instance.onDragLeaveId).toBeNull()
        expect(onDragLeaveFn).not.toHaveBeenCalled()
      })


      it('Should not call "onDragLeave" more than once (props callback)', () => {
        const { onDragLeaveFn, dragStartFnWithDelay, dragLeaveFnWithDelay } = DragNDropSetup()

        dragStartFnWithDelay()
        expect(onDragLeaveFn).not.toHaveBeenCalled()
        dragLeaveFnWithDelay()
        dragLeaveFnWithDelay()
        dragLeaveFnWithDelay()
        expect(onDragLeaveFn).toHaveBeenCalledTimes(1)
      })


      it('Should not call "onDragLeave" (props callback) if itself is being dragged', () => {
        const { getRenderProps, onDragLeaveFn, dragStartFnWithDelay } = DragNDropSetup()

        dragStartFnWithDelay()
        getRenderProps().onDragStartHandler()
        getRenderProps().onDragLeaveHandler()
        expect(onDragLeaveFn).not.toHaveBeenCalled()
      })
    })


    describe('onDragEndHandler()', () => {
      const dragNdrop = DragNDropSetup()


      it('Should not be undefined', () => {
        const { onDragEndHandler } = dragNdrop.getRenderProps()
        expect(onDragEndHandler).not.toBeUndefined()
      })


      it('Should update "dragging" value to false', () => {
        const { getRenderProps } = DragNDropSetup()
        expect(getRenderProps().dragging).toBeFalsy()
        getRenderProps().onDragStartHandler()
        expect(getRenderProps().dragging).toBeTruthy()
        getRenderProps().onDragEndHandler()
        expect(getRenderProps().dragging).toBeFalsy()
      })
    })


    describe('onDropHandler()', () => {
      const dragNdrop = DragNDropSetup()


      it('Should not be undefined', () => {
        const { onDropHandler } = dragNdrop.getRenderProps()
        expect(onDropHandler).not.toBeUndefined()
      })


      it('Should update "dropZoneEnabled" value to false', () => {
        const { getRenderProps, instance } = DragNDropSetup()
        expect(getRenderProps().dropZoneEnabled).toBeFalsy()

        const clock = useFakeTimers()
        getRenderProps().onDragEnterHandler()
        clock.tick(instance.props.delay)
        clock.reset()
        expect(getRenderProps().dropZoneEnabled).toBeTruthy()
        getRenderProps().onDropHandler()
        expect(getRenderProps().dropZoneEnabled).toBeFalsy()
      })
    })
  })
})


