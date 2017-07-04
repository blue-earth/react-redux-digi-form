import React, {
  Component,
  PropTypes
} from 'react';
import { LeftArrowButton, RightArrowButton } from './ArrowButton';
import styles from './ProgressTracker.scss';
import Slider from 'react-slick';

class ProgressTracker extends Component {
  static propTypes = {
    sectionTitleList: PropTypes.array,
    currentSectionIndex: PropTypes.number,
    onItemChange: PropTypes.func,
    percentage: PropTypes.number
  };
  static defaultProps = {
    sectionTitleList: [],
    currentSectionIndex: 0,
    percentage: 0
  };

  static contextTypes = {
    primaryColour: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      currentIndex: props.currentSectionIndex
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentIndex: nextProps.currentSectionIndex
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.currentSectionIndex !== this.state.currentIndex ||
      nextProps.percentage !== this.props.percentage;
  }

  componentDidUpdate(prevProps, prevState) {
    const { progressSlider } = this.refs;
    progressSlider && progressSlider.slickGoTo(this.state.currentIndex);
  }

  handleItemClick = (index) => {
    const { onItemChange } = this.props;
    this.setState({
      currentIndex: index
    }, () => {
      this.refs.progressSlider.slickGoTo(index);
      onItemChange(index);
    });
  }

  render() {
    const { sectionTitleList, percentage } = this.props;
    const { primaryColour } = this.context;
    const { currentIndex } = this.state;
    const that = this;
    if (sectionTitleList && sectionTitleList.length) {
      let sliderSettings = {
        dots: false,
        initialSlide: currentIndex,
        infinite: false,
        nextArrow: <RightArrowButton />,
        prevArrow: <LeftArrowButton />,
        autoplay: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: false,
        touchMove: false,
        swipeToSlide: false,
        variableWidth: true,
        focusOnSelect: true,
        className: styles.slickWrapper,
        ref: 'progressSlider'
      };
      return (
        <div className={styles.wrapper}>
          {percentage < 100 &&
            <Slider {...sliderSettings}>
              {
              sectionTitleList.map((questionGroupTitle, index) => (
                <div key={index} className={styles.stepItem}
                  onClick={function () { that.handleItemClick(index); }}>
                  {index+1}. {questionGroupTitle}
                </div>
              ))
            }
            </Slider>
          }
          <div className={styles.progressbar} style={{ backgroundColor: primaryColour }}>
            <div className={styles.progressbarValue} style={{ width: `${percentage}%` }} />
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default ProgressTracker;
