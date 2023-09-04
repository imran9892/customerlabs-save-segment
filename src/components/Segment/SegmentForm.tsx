import { Option, allOptions } from '../../utils/optionsData';
import DropDown from '../DropDown/DropDown';
import { ModalProps } from '../Modal/Modal';
import styles from './SegmentForm.module.css';
import { useState, useReducer } from 'react';

export type Schema = {
  selected: Option;
  options: Option[];
};
type SchemaAction = {
  type: string;
  payload?: { index: number; value?: string };
};

const dropDownReducer = (
  state: Schema[],
  { type, payload }: SchemaAction
): Schema[] => {
  switch (type) {
    case 'ADD_SCHEMA': {
      //adding all the options from last schema to new schema and removing the last selected option alone
      const lastSchema = state[state.length - 1];
      const newOptions = lastSchema.options.filter(
        (option) => option !== lastSchema.selected
      );
      return [
        ...state,
        {
          selected: { value: '', label: '', traits: '/gray-dot.png' },
          options: newOptions,
        },
      ];
    }

    case 'DELETE_SCHEMA': {
      const index = payload!.index!;
      const deleteValue = state[index].selected.value;
      //if no options are selected, removing the object
      if (!deleteValue) {
        const newState = [...state];
        newState.splice(index, 1);
        return [...newState];
      }
      //adding the selected option of delete to all the other schema options and then deleting it
      const deleteOption = state[index].selected;
      const newState = state.map((schema) => {
        schema.options.push(deleteOption);
        return { ...schema };
      });
      newState.splice(index, 1);
      return [...newState];
    }

    case 'CHANGE_SCHEMA': {
      const index = payload!.index!;
      const value = payload!.value;
      const newState = [...state];
      const selected = state[index].options.find(
        (option) => option.value === value
      )!;
      //changing the value to new value
      newState[index] = { ...newState[index], selected };
      const allValues = newState.map((schema) => schema.selected.value);
      //getting all the options which are not selected
      const newOptions = allOptions.filter(
        (options) => !allValues.includes(options.value)
      );
      //adding remaining options to all schemas and adding there own option
      const newSelects = newState.map((schema) => {
        const ownOption = schema.selected;
        return { ...schema, options: [ownOption, ...newOptions] };
      });
      return [...newSelects];
    }

    default: {
      throw new Error(`Unknown action type: ${type}`);
    }
  }
};

const initialValue: Schema[] = [
  {
    selected: { value: '', label: '', traits: '/gray-dot.png' },
    options: allOptions,
  },
];

type SegmentProps = Pick<ModalProps, 'handleClose'>;

const SegmentForm = ({ handleClose }: SegmentProps) => {
  const [schemas, dispatch] = useReducer(dropDownReducer, initialValue);
  const [segmentName, setSegmentName] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const value = event.target.value;
    if (!value) return;
    dispatch({ type: 'CHANGE_SCHEMA', payload: { index, value } });
  };

  const addSchemaHandler = () => {
    const lastSchema = schemas[schemas.length - 1];
    //if lastschema is not selected or length of schema is reached full, return
    if (!lastSchema.selected.value || schemas.length >= allOptions.length)
      return;
    dispatch({ type: 'ADD_SCHEMA' });
  };

  const handleDelete = (index: number) => {
    //atleast 1 schema should be present;
    if (schemas.length < 2) return;
    dispatch({ type: 'DELETE_SCHEMA', payload: { index } });
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //return if name or a value of schema is empty;
    if (
      !segmentName.trim() ||
      schemas.some((schema) => !schema.selected.value)
    ) {
      alert('Please fill all the inputs');
      return;
    }
    setSubmitting(true);
    //changing the structure of schema data
    const schema = schemas.map((schema) => {
      return { [schema.selected.value]: schema.selected.label };
    });
    const data = { segment_name: segmentName.trim(), schema };
    // Sends a post request to webhook with data
    fetch('https://webhook.site/936c1aad-20bd-4b49-9d20-c373d98c0e18', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(() => {
      setSubmitting(false);
      handleClose();
    });
  };

  return (
    <>
      {submitting && <div className={styles.submitting}></div>}
      <form
        className={styles['form-wrapper']}
        onSubmit={onSubmitHandler}
        autoComplete="off"
      >
        <div>
          <div className={styles.input}>
            <label htmlFor="name">Enter the Name of the Segment</label>
            <input
              id="name"
              value={segmentName}
              placeholder="Name of the Segment"
              onChange={(e) => setSegmentName(e.target.value)}
            />
          </div>
          <p>
            To save your segment, you need to add the schemas to build the query
          </p>
          <div className={styles.traits}>
            <div>
              <img
                src="/green-dot.png"
                alt="user_traits"
                height={10}
                width={10}
              />
              <span>- User Traits</span>
            </div>
            <div>
              <img
                src="/red-dot.png"
                alt="group_traits"
                height={10}
                width={10}
              />
              <span>- Group Traits</span>
            </div>
          </div>
          <div className={styles.schemas}>
            {schemas.map((schema, index) => (
              <DropDown
                {...{ schema, index, handleChange, handleDelete }}
                key={index}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addSchemaHandler}
            className={styles.addButton}
          >
            + Add new schema
          </button>
        </div>
        <div className={styles.actions}>
          <button type="submit" disabled={submitting}>
            Save the Segment
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default SegmentForm;
