// Image.jsx
import NextImage from 'next/image';

const customLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
}

const Image = props => {
  return <NextImage loader={customLoader} {...props} />;
};

export default Image;
