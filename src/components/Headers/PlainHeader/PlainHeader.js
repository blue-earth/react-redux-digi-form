import React,
{
  Component
} from 'react';
import StackLogo from 'components/Logos/StackLogo';
import styles from './PlainHeader.scss';
import { Grid } from 'react-bootstrap';

class PlainHeader extends Component {
  render() {
    return (
      <div className={styles.header}>
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

