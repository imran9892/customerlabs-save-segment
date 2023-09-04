import React from 'react';
import { Schema } from '../Segment/SegmentForm';
import styles from './DropDown.module.css';

type DropDownProps = {
  schema: Schema;
  index: number;
  handleChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => void;
  handleDelete: (index: number) => void;
};

const DropDown = ({
  schema,
  index,
  handleChange,
  handleDelete,
}: DropDownProps) => {
  return (
    <div className={styles.schema}>
      <img src={schema.selected.traits} alt="traits" height={12} width={12} />
      <select
        value={schema.selected.value}
        onChange={(e) => handleChange(e, index)}
      >
        <option value={''} disabled hidden>
          Add schema to segment
        </option>
        {schema.options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => handleDelete(index)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 448 512"
        >
          <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
        </svg>
      </button>
    </div>
  );
};

export default DropDown;
