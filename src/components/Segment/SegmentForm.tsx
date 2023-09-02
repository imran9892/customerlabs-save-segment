import { ModalProps } from '../Modal/Modal';
import styles from './SegmentForm.module.css';
import { useState, useReducer } from 'react';

type Option = {
  value: string;
  label: string;
  traits: string;
};
type Schema = {
  value: string;
  options: Option[];
};
type SchemaAction = {
  type: string;
  payload: { index?: number; value?: string };
};

const allOptions: Option[] = [
  {
    value: 'first_name',
    label: 'First Name',
    traits: '/green-dot.png',
  },
  {
    value: 'last_name',
    label: 'Last Name',
    traits: '/green-dot.png',
  },
  {
    value: 'gender',
    label: 'Gender',
    traits: '/green-dot.png',
  },
  {
    value: 'age',
    label: 'Age',
    traits: '/green-dot.png',
  },
  {
    value: 'account_name',
    label: 'Account Name',
    traits: '/red-dot.png',
  },
  {
    value: 'city',
    label: 'City',
    traits: '/red-dot.png',
  },
  {
    value: 'state',
    label: 'State',
    traits: '/red-dot.png',
  },
];

const reducer = (state: Schema[], action: SchemaAction): Schema[] => {
  switch (action.type) {
    case 'add_schema': {
      //adding all the options from last schema to new schema and removing the last selected option alone
      const lastSelected = state[state.length - 1];
      const newOptions = lastSelected.options.filter(
        (option) => option.value !== lastSelected.value
      );
      return [...state, { value: '', options: newOptions }];
    }

    case 'delete_schema': {
      const index = action.payload.index!;
      const deleteValue = state[index].value;
      //if no options are selected, removing the object
      if (!deleteValue) {
        const newState = [...state];
        newState.splice(index, 1);
        return [...newState];
      }
      //adding the delete option to all the other schema options and then deleting it
      const deleteOption = state[index].options.find(
        (option) => option.value === deleteValue
      )!;
      const newState = state.map((schema) => {
        schema.options.push(deleteOption);
        return { ...schema };
      });
      newState.splice(index, 1);
      return [...newState];
    }

    case 'change_schema': {
      const index = action.payload.index!;
      const value = action.payload.value!;
      const newState = [...state];

      //changing the value to new value
      newState[index] = { ...newState[index], value };
      const allValues = newState.map((schema) => schema.value);

      //getting all the options which are not selected
      const newOptions = allOptions.filter(
        (options) => !allValues.includes(options.value)
      );

      //adding remaining options to all schemas and adding there own option
      const newSelects = newState.map((schema) => {
        const ownOption = schema.options.find(
          (option) => option.value === schema.value
        )!;
        return { ...schema, options: [ownOption, ...newOptions] };
      });
      return [...newSelects];
    }
    default: {
      return [...state];
    }
  }
};

type SegmentProps = Pick<ModalProps, 'handleClose'>;

const SegmentForm = ({ handleClose }: SegmentProps) => {
  const [schemas, dispatch] = useReducer(reducer, [
    { value: '', options: allOptions },
  ]);
  const [segmentName, setSegmentName] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const value = event.target.value;
    if (!value) return;
    dispatch({ type: 'change_schema', payload: { index, value } });
  };

  const addSchemaHandler = () => {
    const lastSelected = schemas[schemas.length - 1];
    //if lastschema is not selected or length of schema is reached full, return
    if (!lastSelected.value || schemas.length >= allOptions.length) return;
    dispatch({ type: 'add_schema', payload: {} });
  };

  const DeleteHandler = (index: number) => {
    //atleast 1 schema should be present;
    if (schemas.length < 2) return;
    dispatch({ type: 'delete_schema', payload: { index } });
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!segmentName.trim() || schemas.some((schema) => schema.value === '')) {
      alert('Please fill all the inputs');
      return;
    }
    setSubmitting(true);
    //return if name or a value of schema is empty;
    //changing the structure of schema data
    const schema = schemas.map((schema) => {
      const label = schema.options.find(
        (option) => schema.value === option.value
      )!.label;
      return { [schema.value]: label };
    });
    const data = { segment_name: segmentName, schema };

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
              <div key={index}>
                <img
                  src={
                    schema.value
                      ? schema.options.find(
                          (option) => option.value === schema.value
                        )!.traits
                      : '/gray-dot.png'
                  }
                  alt="traits"
                  height={12}
                  width={12}
                />
                <select
                  value={schema.value}
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
                <button type="button" onClick={() => DeleteHandler(index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                  >
                    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                  </svg>
                </button>
              </div>
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
