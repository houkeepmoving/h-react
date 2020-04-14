import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './star-rating.scss';


const StarRating = ({ width = '80%' }) => {
  let starNums = [1, 2, 3, 4, 5];
  return (
    <div className='star' data-role="star" >
      <div className='comment_star'>
        <span className='dark'>
          { starNums.map((item, index) => (
            <i className={classNames('icon_collect')} key={index}></i>
          )) }
        </span>
        <span className='light' style={{width: width}}>
          { starNums.map((item, index) => (
            <i className={classNames('icon_star2')} key={index}></i>
          )) }
        </span>
      </div>
    </div>
  );
};


StarRating.propTypes = {
  width: PropTypes.string.isRequired
};

export default StarRating;


