import styles from './ImageGrid.module.css'

const ImageGrid = ({ images }) => {
    return (
        <div className={styles.imageGrid}>
            {images.map((img, idx) => (
                <img key={idx} src={img} alt={`image-${idx}`} />
            ))}
        </div>
    );
};

export default ImageGrid;
