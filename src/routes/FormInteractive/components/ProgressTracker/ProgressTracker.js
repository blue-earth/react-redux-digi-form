import React, {
  Component,
  PropTypes
} from 'react';
import ArrowButton from './ArrowButton';
import styles from './ProgressTracker.scss';
import classNames from 'classnames';
import Slider from 'react-slick';

class ProgressTracker extends Component {
  static propTypes = {
    sectionTitleList: PropTypes.array,
    currentSectionIndex: PropTypes.number,
    setActiveStepIndex: PropTypes.func
  };
  static defaultProps = {
    sectionTitleList: [],
    currentSectionIndex: 0
  };

  static contextTypes = {
    primaryColor: PropTypes.string
  };

  addHoverClass = () => {

  }

  render() {
    const { sectionTitleList, currentSectionIndex, setActiveStepIndex } = this.props;
    const { primaryColor } = this.context;
    if (sectionTitleList && sectionTitleList.length) {
      let sliderSettings = {
        dots: false,
        infinite: false,
        nextArrow: false,
        prevArrow: false,
        arrows: false,
        autoplay: false,
        centerMode: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipe: false,
        touchMove: false,
        swipetoSlide: false,
        adaptiveHeight: true,
        variableWidth: true
      };
      return (
        <div className={styles.wrapper}>
          <Slider {...sliderSettings}>
            {
            sectionTitleList.map((questionGroupTitle, index) => (
              <div key={index} className={classNames({
                [styles.stepItem]: true,
                [styles.active]: index === currentSectionIndex})}
                onClick={setActiveStepIndex}>
                {index+1}. {questionGroupTitle}
              </div>
            ))
          }
          </Slider>
          <div className={styles.progressbar} style={{ backgroundColor: primaryColor }}>
            <div className={styles.progressbarValue} />
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default ProgressTracker;
