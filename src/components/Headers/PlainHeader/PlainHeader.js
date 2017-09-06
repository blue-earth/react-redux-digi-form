import React,
{
  Component,
  PropTypes
} from 'react';
import StackLogo from 'components/Logos/StackLogo';
import styles from './PlainHeader.scss';
import { Grid } from 'react-bootstrap';
import classNames from 'classnames';

class PlainHeader extends Component {

  static propTypes = {
    extraClass: PropTypes.string
  }

  render() {
    return (
      <div className={classNames(styles.header, this.props.extraClass)}>
        <Grid fluid>
          <div className="text-center">
            <StackLogo className={styles.logo} width="auto" height={38} logoStyle="white" />
          </div>
        </Grid>
      </div>
    );
  }
}

export default PlainHeader;

