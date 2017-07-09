import React, {
  Component,
  PropTypes
} from 'react';
import {
  FaCaretLeft,
  FaCaretRight
} from 'react-icons/lib/fa';
import {Button} from 'react-bootstrap';
import styles from './PaginationComponent.scss';
import classNames from 'classnames';

export default class PaginationComponent extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    maxPage: PropTypes.number.isRequired,
    previous: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired
  };

  render() {
    const { currentPage, maxPage, previous, next } = this.props;
    return (
      <div className={styles.pagination}>
        <div className={classNames(styles.paginationItem, {hide: maxPage === 0})}>
          <Button className={styles.paginationButton} onClick={previous} disabled={currentPage === 0}>
            <FaCaretLeft />
          </Button>
          <span className={styles.paginationIndicator}>
            Page
            {' '}
            <span className={styles.currentPage}>{currentPage + 1}</span>
            {' '}
            of
            {' '}
            <span>{maxPage}</span>
          </span>
          <Button className={styles.paginationButton} onClick={next} disabled={currentPage + 1 === maxPage}>
            <FaCaretRight />
          </Button>
        </div>
      </div>
    );
  }
}
