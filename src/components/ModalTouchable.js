import React from "react";
import { TouchableOpacity } from "react-native";
import { withModal } from "react-native-modalfy";

class ModalTouchable extends React.Component {
  openModal = () => {
    const { modalToOpen, modal } = this.props;

    modal.openModal(modalToOpen);
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.openModal}
        activeOpacity={0.9}
        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

export default withModal(ModalTouchable);
