import React from 'react';



class FormInteractiveView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h4>FormInteractive! page id {this.props.params.id}</h4>
    }
}

export default FormInteractiveView;
