import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { modals } from '../Connector';
import BackDrop from '../BackDrop';


class ModalPlaceHolder extends Component {
  constructor(props) {
    super(props);
    this.mountedModalsId = []

    this.mountModal = this.mountModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateModals = this.updateModals.bind(this);
    this.docClickHandler = this.docClickHandler.bind(this);

    this.state = {
      MountedModals: []
    }
  }

  updateModals(cb){
    const {MountedModals} = this.state;
    this.setState({
      MountedModals: [...MountedModals]
    }, cb || (() => {}))
  }

  docClickHandler(event){
    const {MountedModals} = this.state;
    if(MountedModals.length == 0) return;

    const lastModalConfig = MountedModals[MountedModals.length - 1]
    if(!lastModalConfig.ref) return;

    if(!lastModalConfig.show || !lastModalConfig.fadeEffect) return;

    const isInside = lastModalConfig.ref.contains(event.target)
    const isModalContainer = (event.target == lastModalConfig.ref)
    if(isInside && !isModalContainer) return;

    lastModalConfig.closeModalHandler()
  }

  componentDidMount(){
    document.addEventListener('click', this.docClickHandler)
  }

  componentWillUnmount(){
    document.removeEventListener('click', this.docClickHandler)
  }

  showModal({id}){
    return () => {
      const {MountedModals} = this.state;
      const {delay} = this.props;
      if(!this.mountedModalsId.includes(id)) return;

      const modalConfig = MountedModals.find((config) => config.id == id)
      modalConfig.show = true;
      this.updateModals(() => {
        setTimeout(() => {
          modalConfig.fadeEffect = true;
          this.updateModals();
        }, delay)
      })
    }
  }

  closeModal({id}){
    return () => {
      const {MountedModals} = this.state;
      const {delay} = this.props;
      if(!this.mountedModalsId.includes(id)) return;

      const modalConfig = MountedModals.find((config) => config.id == id)
      modalConfig.fadeEffect = false;
      this.updateModals(() => {
        setTimeout(() => {
          modalConfig.show = false;
          this.updateModals(() => {
            this.unMountModal({id})
          });
        }, delay)
      })
    }
  }

  unMountModal({id}){
    const {MountedModals} = this.state;
    this.setState({
      MountedModals: MountedModals.filter(config => config.id != id)
    })
    this.mountedModalsId.splice(this.mountedModalsId.indexOf(id), 1)
  }

  mountModal(modalConfig){
    const {MountedModals} = this.state;
    const {id, targetModal} = modalConfig;
    if(this.mountedModalsId.includes(id)) return;

    this.mountedModalsId.push(id)
    const newModalConfig = {
      ...modalConfig,
      Modal: modals[targetModal],
      show: false,
      fadeEffect: false,
      ref: null,
      refHandler: (ref) => newModalConfig.ref = ref,
      showModalHandler: this.showModal({id}),
      closeModalHandler: this.closeModal({id}),
    }
    this.setState({
      MountedModals: [...MountedModals, newModalConfig]
    })
  }


  componentDidUpdate(prevProps, prevState){
    const {activeModal} = this.props.modals;

    if((prevProps.modals.activeModal != activeModal) && activeModal){
      this.mountModal(activeModal)
    }
  }


  render(){
    const {MountedModals} = this.state;
    const {modals} = this.props;
    return MountedModals.map(({id, backDrop, refHandler, show, fadeEffect, closeModalHandler, showModalHandler, Modal}) => (
      <Fragment key={id}>
        <Modal
          modal={modals.data[id]}
          modalShow={show}
          modalFadeIn={fadeEffect}
          modalClose={closeModalHandler}
          modalRefHandler={refHandler}
          showModalHandler={showModalHandler} />
        {backDrop && <BackDrop show={show} />}
      </Fragment>
    ))
  }
}

ModalPlaceHolder.propTypes = {
};

ModalPlaceHolder.defaultProps = {
  delay: 200
}


const mapStateToProps = ({modals}) => ({modals})
export default connect(mapStateToProps)(
  ModalPlaceHolder
);
