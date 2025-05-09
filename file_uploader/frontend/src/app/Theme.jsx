import { Theme as RadixTheme } from '@radix-ui/themes';

const Theme = ({ children }) => {
    return (
        <RadixTheme appearance="light" accentColor="indigo" radius="medium">
            <div className="p-6 flex justify-center items-center h-screen">
                {children}
            </div>
        </RadixTheme>
    );
};

export default Theme;
