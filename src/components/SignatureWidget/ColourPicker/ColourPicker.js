import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames';
import styles from './ColourPicker.scss';
import { colours } from 'schemas/signatureSchema';

class ColourPicker extends Component {

  static propTypes = {
    onChange: PropTypes.func
  };

  static defaultProps = {
    onChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      activeColour: 'black'
    };
  }

  handleSelectActiveColour = (colour) => {
    this.setState({
      activeColour: colour
    });
    this.props.onChange(colours[colour]);
  }

  render() {
    const { activeColour } = this.state;
    return (
      <ul className={styles.colourSelectionWrapper}>
        {Object.keys(colours).map((colourName, index) => {
          const colour = colours[colourName];
          let boundSelectActiveColour = this.handleSelectActiveColour.bind(this, colourName); // eslint-disable-line
          return (
            <li
              key={`colour-${index}`}
              onClick={boundSelectActiveColour}
              className={classNames(styles.colourSelection, {
                [styles.activeColour]: activeColour === colourName
              })}
              style={{backgroundColor: colour}}>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default ColourPicker;
