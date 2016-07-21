import React, {
  Component,
  PropTypes
} from 'react';
import {
  Row,
  Col,
  Button,
  Dropdown,
  MenuItem
} from 'react-bootstrap';
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/lib/fa';
import styles from './Pagination.scss';

export default class Pagination extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    maxPage: PropTypes.number.isRequired,
    previous: PropTypes.func.isRequired,
    next: PropTypes.func.isReuqired,
    setPage: PropTypes.func.isRequired,
    pageSize: PropTypes.number.isRequired,
    fetchSubmissions: PropTypes.func.isRequired
  };

  static defaultProps = {
    maxPage: 0,
    currentPage: 0
  };

  changePage = (page) => {
    const { setPage } = this.props;
    setPage(parseInt(page));
  }

  firstPage = () => {
    const { setPage } = this.props;
    setPage(0);
  }

  lastPage = () => {
    const { setPage, maxPage } = this.props;
    setPage(maxPage - 1);
  }

  changePageSize = (pageSize) => {
    const { fetchSubmissions } = this.props;
    fetchSubmissions({
      page: 0,
      pageSize
    });
  }

  renderPageSize() {
    const { pageSize } = this.props;
    return (
      <Dropdown pullRight dropup={pageSize >= 20} onSelect={this.changePageSize}>
        <Dropdown.Toggle bsSize="xsmall">
          {`Show: ${pageSize}`}
        </Dropdown.Toggle>
        <Dropdown.Menu className={styles.pageSizeDropdown}>
          <MenuItem eventKey={2}>2</MenuItem>
          <MenuItem eventKey={10}>10</MenuItem>
          <MenuItem eventKey={20}>20</MenuItem>
          <MenuItem eventKey={25}>25</MenuItem>
          <MenuItem eventKey={50}>50</MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderPagination() {
    const { currentPage, maxPage, pageSize, previous, next } = this.props;
    var options = [];
    console.log(this.props);

    for (var i = 0; i < maxPage; i++) {
      options.push(<MenuItem key={i} eventKey={i}>{i + 1}</MenuItem>);
    }
    return (
      <div className={styles.pagination}>
        <div className={styles.paginationItem}>
          <Button className={styles.paginationButton} onClick={previous}>
            <FaAngleLeft />
          </Button>
        </div>
        <div className={styles.paginationItem}>
          <Button className={styles.paginationButton} onClick={this.firstPage}>
            <FaAngleDoubleLeft />
          </Button>
        </div>
        <div className={styles.paginationItem}>
          <Dropdown pullRight dropup={pageSize >= 20} onSelect={this.changePage}>
            <Dropdown.Toggle bsSize="xsmall">
              {currentPage + 1}
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.paginationDropdown}>
              {options}
            </Dropdown.Menu>
          </Dropdown>
          <span className={styles.maxPage}>{` of ${maxPage}`}</span>
        </div>
        <div className={styles.paginationItem}>
          <Button className={styles.paginationButton} onClick={this.lastPage}>
            <FaAngleDoubleRight />
          </Button>
        </div>
        <div className={styles.paginationItem}>
          <Button className={styles.paginationButton} onClick={next}>
            <FaAngleRight />
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Row>
        <Col sm={4}>
          {this.renderPageSize()}
        </Col>
        <Col sm={8}>
          {this.renderPagination()}
        </Col>
      </Row>
    );
  }
}
