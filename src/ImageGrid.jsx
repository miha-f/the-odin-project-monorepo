import styles from './ImageGrid.module.css'

const ImageGrid = ({ images, onClick }) => {
    const urls = Object.values(images);
    const names = Object.keys(images);

    return (
        <div className={styles.imageGrid}>
            {urls.map((img, idx) => (
                <img onClick={() => onClick(names[idx])} key={names[idx]} src={img} alt={`image-${idx}`} />
            ))}
        </div>
    );
};

export default ImageGrid;
