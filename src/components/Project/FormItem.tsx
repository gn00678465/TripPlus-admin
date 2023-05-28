import {
  FormControl,
  FormControlProps,
  Box,
  FormLabel,
  FormErrorMessage
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

export interface FormItem extends Omit<FormControlProps, 'children'> {
  children: JSX.Element | JSX.Element[];
  label: string;
  path:
    | keyof Project.FormBasicSettings
    | keyof Project.FormPaymentSettings
    | keyof Project.FormKeyVisionSettings
    | keyof Project.FormOptionSettings;
  showFeedback?: boolean;
}

export const FormItem = ({
  children,
  label,
  path,
  showFeedback = true,
  ...rest
}: FormItem) => {
  const {
    formState: { errors }
  } = useFormContext();
  return (
    <FormControl flexShrink={0} isInvalid={!!errors[path]} {...rest}>
      <Box
        display={{ base: 'block', sm: 'flex', md: 'block', '2xl': 'flex' }}
        alignItems="center"
      >
        <FormLabel
          mb={{ base: 2, '2xl': 0 }}
          flexShrink={0}
          flexBasis={{ base: 'auto', sm: '125px', md: 'auto', '2xl': '130px' }}
        >
          {label}
        </FormLabel>
        <div className="grow">{children}</div>
      </Box>
      {showFeedback && !!errors[path] && (
        <FormErrorMessage className="visible">
          {errors[path]?.message as string}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
