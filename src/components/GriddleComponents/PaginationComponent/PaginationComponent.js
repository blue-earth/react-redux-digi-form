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
        <div className={styles.paginationItem}>
          <Button className={classNames(styles.paginationButton, {invisible: currentPage === 1})} onClick={previous}>
            <FaCaretLeft />
          </Button>
          <span className={styles.paginationIndicator}>
            Page
            {' '}
            <span className={styles.currentPage}>{currentPage}</span>
            {' '}
            of
            {' '}
            <span>{maxPage || 1}</span>
          </span>
          <Button className={classNames(
            styles.paginationButton,
            {invisible: currentPage + 1 > maxPage}
          )} onClick={next}>
            <FaCaretRight />
          </Button>
        </div>
      </div>
    );
  }
}
