import React, { Component } from 'react';
import PropTypes from 'prop-types';


import ProjectFormHelper from 'App/Form/Project/Helper';


class EditView extends Component {
  constructor(props) {
    super(props);
    this.containerRef = null;
    this.containerRefHandler = ref => this.containerRef = ref;

    this.docClickHandler = this.docClickHandler.bind(this);
  }

  docClickHandler({target}){
    const isInside = this.containerRef.contains(target)
    if(isInside) return;

    const {closeEditView} = this.props;
    closeEditView()
  }

  componentDidMount(){
    document.addEventListener('click', this.docClickHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.docClickHandler)
  }

  render(){
    const {project, closeEditView} = this.props;
    return (
      <div ref={this.containerRefHandler}>
        <ProjectFormHelper project={project} onSuccess={closeEditView}>
          {({TitleField, DescriptionField, AssetsDirField, onSubmit}) => (
            <form onSubmit={onSubmit}>
              <hr/>
              <TitleField />
              <DescriptionField />
              <AssetsDirField />
              <hr/>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={closeEditView}>
                Close
              </button>
              <button
                className="btn btn-success pull-right"
                type="submit"
                onClick={onSubmit}>
                Save Changes
              </button>
              <hr/>
            </form>
          )}
        </ProjectFormHelper>
      </div>
    );
  }
}

EditView.propTypes = {

};

export default EditView;
