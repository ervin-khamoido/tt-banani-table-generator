import { FunctionComponent } from "react";

interface Props {
  loading: boolean;
}

const Loader: FunctionComponent<Props> = ({ loading }) => {
  const classNameToRender = loading
    ? "material-symbols-outlined w-5 h-5 animate-spin"
    : "material-symbols-outlined w-5 h-5";
  const iconToRender = loading ? "sync" : "arrow_upward";

  return <span className={classNameToRender}>{iconToRender}</span>;
};

export default Loader;
