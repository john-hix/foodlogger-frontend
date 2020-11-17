import { TopBarProps, TopBarPropsUpdate } from "./Appbar";

export default interface TopBarAwareProps {
    changeAppBar: (state: TopBarPropsUpdate) => void;
    state: TopBarProps;
}
