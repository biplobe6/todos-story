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

  const testHelperOnDragStart = () => {
    const clock = useFakeTimers()
    getRenderProps().onDragEnterHandler()
    clock.tick(instance.props.delay)
    clock.reset()
  }

  return ({
    wrapper,
    instance,
    getRenderProps,
    onDragEnterFn,
    onDragLeaveFn,
    testHelperOnDragStart,
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


      it('Should call "onDragEnter" (props callback)', () => {
        const {onDragEnterFn, testHelperOnDragStart} = DragNDropSetup();
        expect(onDragEnterFn).not.toHaveBeenCalled()
        testHelperOnDragStart()
        expect(onDragEnterFn).toHaveBeenCalled()
      })


      it('Should not call "onDragEnter" more than once (props callback).', () => {
        const {onDragEnterFn, testHelperOnDragStart} = DragNDropSetup();
        expect(onDragEnterFn).not.toHaveBeenCalled()
        testHelperOnDragStart()
        testHelperOnDragStart()
        testHelperOnDragStart()
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
        const { getRenderProps, testHelperOnDragStart } = DragNDropSetup()
        expect(getRenderProps().dropZoneEnabled).toBeFalsy()

        testHelperOnDragStart()
        expect(getRenderProps().dropZoneEnabled).toBeTruthy()

        getRenderProps().onDragLeaveHandler()
        expect(getRenderProps().dropZoneEnabled).toBeFalsy()
      })


      it('Should call "onDragLeave" (props callback)', () => {
        const { getRenderProps, onDragLeaveFn, testHelperOnDragStart } = DragNDropSetup()

        testHelperOnDragStart()
        expect(onDragLeaveFn).not.toHaveBeenCalled()
        getRenderProps().onDragLeaveHandler()
        expect(onDragLeaveFn).toHaveBeenCalled()
      })


      it('Should not call "onDragLeave" more than once (props callback)', () => {
        const { getRenderProps, onDragLeaveFn, testHelperOnDragStart } = DragNDropSetup()

        testHelperOnDragStart()
        expect(onDragLeaveFn).not.toHaveBeenCalled()
        getRenderProps().onDragLeaveHandler()
        getRenderProps().onDragLeaveHandler()
        getRenderProps().onDragLeaveHandler()
        expect(onDragLeaveFn).toHaveBeenCalledTimes(1)
      })


      it('Should not call "onDragLeave" (props callback) if itself is being dragged', () => {
        const { getRenderProps, onDragLeaveFn, testHelperOnDragStart } = DragNDropSetup()

        testHelperOnDragStart()
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


